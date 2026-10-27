'use client';

import * as React from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { brand } from '@/lib/brand';
import { LeadSchema } from '@/lib/lead';
import { submitLead } from '@/lib/actions/lead';

/**
 * One conversation for the whole site.
 *
 * Free questions go to the AI (/api/chat). When the visitor wants the office
 * to get back to them, a short guided intake runs in the same thread:
 * name, area, urgency, phone, optional note, explicit confirmation. The intake
 * is deterministic (no AI needed), so it works even without an API key, and its
 * messages are never sent to the model.
 */

export type IntakeStep = 'name' | 'topic' | 'urgency' | 'phone' | 'note' | 'confirm';

export const INTAKE_STEPS: IntakeStep[] = ['name', 'topic', 'urgency', 'phone', 'note', 'confirm'];

export interface Chip {
  label: string;
  value: string;
}

/** UI-only extras attached to a synthetic message (chips, links). */
export interface Extras {
  chips?: Chip[];
  whatsapp?: string;
  call?: boolean;
}

interface IntakeData {
  name: string;
  matter: string;
  urgency: string;
  phone: string;
  note: string;
}

const EMPTY: IntakeData = { name: '', matter: '', urgency: '', phone: '', note: '' };

const URGENCY: Chip[] = [
  { value: 'urgent', label: 'דחוף, יש מועד קרוב' },
  { value: 'soon', label: 'בימים הקרובים' },
  { value: 'calm', label: 'אין לחץ של זמן' },
];

const SKIP = '__skip';
const YES = '__yes';
const RESTART = '__restart';

const INTAKE_PREFIX = 'intake-';
const STORAGE_KEY = 'concierge-chat-v1';
const BOOK_LABEL = 'קביעת ייעוץ';

/** The AI part of the conversation survives a refresh (this tab only). */
function loadSaved(): UIMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as UIMessage[]).filter(
      (m) => m && typeof m.id === 'string' && Array.isArray(m.parts),
    );
  } catch {
    return [];
  }
}

const greeting: UIMessage = {
  id: 'greeting',
  role: 'assistant',
  parts: [{ type: 'text', text: brand.chat.greeting }],
};

function uid(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export interface Concierge {
  messages: UIMessage[];
  extras: Record<string, Extras>;
  status: ReturnType<typeof useChat>['status'];
  error: Error | undefined;
  /** True while the model is answering or the intake is being submitted. */
  busy: boolean;
  intakeStep: IntakeStep | null;
  panelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  /** Routes the text to the intake when one is running, otherwise to the AI. */
  send: (text: string) => void;
  choose: (chip: Chip) => void;
  startIntake: () => void;
  cancelIntake: () => void;
  stop: () => void;
}

const ConciergeContext = React.createContext<Concierge | null>(null);

export function useConcierge(): Concierge {
  const ctx = React.useContext(ConciergeContext);
  if (!ctx) throw new Error('useConcierge must be used inside <ConciergeProvider>');
  return ctx;
}

export function ConciergeProvider({ children }: { children: React.ReactNode }) {
  const [sessionId] = React.useState(uid);
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [intake, setIntake] = React.useState<{ step: IntakeStep; data: IntakeData } | null>(null);
  const [extras, setExtras] = React.useState<Record<string, Extras>>({});
  const [submitting, setSubmitting] = React.useState(false);

  const transport = React.useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        // Intake messages hold personal details: never send them to the model.
        prepareSendMessagesRequest: ({ messages }) => ({
          body: {
            sessionId,
            page: window.location.pathname,
            messages: messages.filter((m) => !m.id.startsWith(INTAKE_PREFIX)),
          },
        }),
      }),
    [sessionId],
  );

  const chat = useChat({ transport, messages: [greeting] });
  const { setMessages } = chat;

  // Restore the previous AI conversation after a refresh. Intake messages hold
  // personal details and are never stored.
  const restored = React.useRef(false);
  React.useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const saved = loadSaved();
    if (saved.length > 0) setMessages([greeting, ...saved]);
  }, [setMessages]);

  React.useEffect(() => {
    if (!restored.current || chat.status !== 'ready') return;
    const keep = chat.messages.filter((m) => m.id !== greeting.id && !m.id.startsWith(INTAKE_PREFIX));
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(keep.slice(-30)));
    } catch {
      /* storage unavailable: the chat still works */
    }
  }, [chat.messages, chat.status]);

  const say = React.useCallback(
    (role: 'user' | 'assistant', text: string, ex?: Extras) => {
      const id = `${INTAKE_PREFIX}${role}-${uid()}`;
      setMessages((prev) => [...prev, { id, role, parts: [{ type: 'text', text }] }]);
      if (ex) setExtras((prev) => ({ ...prev, [id]: ex }));
    },
    [setMessages],
  );

  const topicChips = React.useMemo<Chip[]>(
    () => [
      ...brand.practiceAreas.map((a) => ({ value: a.title, label: a.title })),
      { value: 'לא בטוח/ת', label: 'לא בטוח/ת' },
    ],
    [],
  );

  const finish = React.useCallback(
    async (data: IntakeData) => {
      setSubmitting(true);
      try {
        const fd = new FormData();
        fd.set('name', data.name);
        fd.set('phone', data.phone);
        fd.set('matter', data.matter);
        fd.set(
          'message',
          [`דחיפות: ${URGENCY.find((u) => u.value === data.urgency)?.label ?? ''}`, data.note]
            .filter(Boolean)
            .join(' | ')
            .slice(0, 1000),
        );
        const result = await submitLead({ status: 'idle' }, fd);

        if (result.status === 'sent') {
          say(
            'assistant',
            'הפרטים הועברו למשרד, ונחזור אליך בהקדם. אם נוח לך, אפשר גם להמשיך את השיחה בוואטסאפ.',
            { whatsapp: result.waHref },
          );
        } else if (result.status === 'handoff') {
          say(
            'assistant',
            'כמעט סיימנו. הכנתי לך הודעה מוכנה עם כל הפרטים. לחצו לשליחה בוואטסאפ והיא תגיע ישירות למשרד.',
            { whatsapp: result.waHref },
          );
        } else {
          say(
            'assistant',
            result.message ?? `אירעה תקלה. אפשר להתקשר אלינו ל-${brand.phone}.`,
            { call: true },
          );
        }
      } catch {
        say('assistant', `אירעה תקלה בשליחה. אפשר להתקשר אלינו ל-${brand.phone}.`, { call: true });
      } finally {
        setSubmitting(false);
        setIntake(null);
      }
    },
    [say],
  );

  /** Advances the intake by one step. `shown` is what the visitor sees as their reply. */
  const answer = React.useCallback(
    (value: string, shown?: string) => {
      if (!intake) return;
      const text = value.trim();
      const { step, data } = intake;

      // Explicit actions that are valid at any step.
      if (value === RESTART) {
        say('user', shown ?? 'להתחיל מחדש');
        say('assistant', 'בשמחה, מתחילים מחדש. איך קוראים לך?');
        setIntake({ step: 'name', data: EMPTY });
        return;
      }

      if (step === 'name') {
        say('user', shown ?? text);
        if (text.length < 2 || text.length > 60) {
          say('assistant', 'אשמח לשם שאפשר לפנות אליו, לפחות שתי אותיות.');
          return;
        }
        say('assistant', `נעים להכיר, ${text}. באיזה תחום מדובר?`, { chips: topicChips });
        setIntake({ step: 'topic', data: { ...data, name: text } });
        return;
      }

      if (step === 'topic') {
        say('user', shown ?? text);
        if (!text) return;
        say('assistant', 'ועד מתי חשוב לך לקבל מענה?', { chips: URGENCY });
        setIntake({ step: 'urgency', data: { ...data, matter: text.slice(0, 80) } });
        return;
      }

      if (step === 'urgency') {
        const known = URGENCY.find((u) => u.value === value || u.label === text);
        say('user', shown ?? known?.label ?? text);
        const urgency = known?.value ?? 'soon';
        say(
          'assistant',
          urgency === 'urgent'
            ? 'כשיש מועד קרוב כדאי לדבר ישירות. אפשר להתקשר עכשיו, ובמקביל אשאיר את הפרטים. מה מספר הטלפון שלך?'
            : 'מה מספר הטלפון שלך? נחזור אליך בהקדם.',
          urgency === 'urgent' ? { call: true } : undefined,
        );
        setIntake({ step: 'phone', data: { ...data, urgency } });
        return;
      }

      if (step === 'phone') {
        say('user', shown ?? text);
        const parsed = LeadSchema.shape.phone.safeParse(text);
        if (!parsed.success) {
          say('assistant', 'המספר לא נראה לי תקין. אפשר לכתוב אותו שוב, למשל 050-0000000?');
          return;
        }
        say(
          'assistant',
          'רוצה להוסיף משפט על העניין? אין צורך לפרט את האירוע, ואפשר לדלג.',
          { chips: [{ value: SKIP, label: 'דלג' }] },
        );
        setIntake({ step: 'note', data: { ...data, phone: parsed.data } });
        return;
      }

      if (step === 'note') {
        const note = value === SKIP ? '' : text.slice(0, 300);
        say('user', shown ?? (note || 'דלג'));
        const urgencyLabel = URGENCY.find((u) => u.value === data.urgency)?.label ?? '';
        say(
          'assistant',
          [
            'בואו נוודא שהכול נכון:',
            `שם: ${data.name}`,
            `תחום: ${data.matter}`,
            `דחיפות: ${urgencyLabel}`,
            `טלפון: ${data.phone}`,
            note ? `הערה: ${note}` : '',
            '',
            'מאשר/ת שאעביר את הפרטים האלה למשרד?',
          ]
            .filter((line, i, arr) => line !== '' || arr[i - 1] !== '')
            .join('\n'),
          {
            chips: [
              { value: YES, label: 'כן, שלחו' },
              { value: RESTART, label: 'להתחיל מחדש' },
            ],
          },
        );
        setIntake({ step: 'confirm', data: { ...data, note } });
        return;
      }

      // confirm
      if (value === YES) {
        say('user', shown ?? 'כן, שלחו');
        void finish(data);
        return;
      }
      say('user', shown ?? text);
      say('assistant', 'כדי להמשיך, לחצו על "כן, שלחו" או על "להתחיל מחדש".', {
        chips: [
          { value: YES, label: 'כן, שלחו' },
          { value: RESTART, label: 'להתחיל מחדש' },
        ],
      });
    },
    [intake, say, topicChips, finish],
  );

  const startIntake = React.useCallback(() => {
    setPanelOpen(true);
    if (intake || submitting) return;
    setIntake({ step: 'name', data: EMPTY });
    say(
      'assistant',
      'בשמחה. אשאל כמה שאלות קצרות כדי שהמשרד יחזור אליך, בלי צורך לפרט את המקרה. איך קוראים לך?',
    );
  }, [intake, submitting, say]);

  const cancelIntake = React.useCallback(() => {
    if (!intake) return;
    setIntake(null);
    say('assistant', 'אין בעיה, לא שלחתי כלום. אפשר להמשיך לשאול אותי כל דבר.');
  }, [intake, say]);

  const aiBusy = chat.status === 'submitted' || chat.status === 'streaming';
  const busy = aiBusy || submitting;

  const send = React.useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || busy) return;
      if (intake) {
        answer(value);
        return;
      }
      void chat.sendMessage({ text: value });
    },
    [busy, intake, answer, chat],
  );

  const choose = React.useCallback(
    (chip: Chip) => {
      if (busy) return;
      if (intake) answer(chip.value, chip.label);
      else if (chip.label === BOOK_LABEL) startIntake();
      else send(chip.label);
    },
    [busy, intake, answer, send, startIntake],
  );

  const value = React.useMemo<Concierge>(
    () => ({
      messages: chat.messages,
      extras,
      status: chat.status,
      error: chat.error,
      busy,
      intakeStep: intake?.step ?? null,
      panelOpen,
      openPanel: () => setPanelOpen(true),
      closePanel: () => setPanelOpen(false),
      send,
      choose,
      startIntake,
      cancelIntake,
      stop: () => void chat.stop(),
    }),
    [chat, extras, busy, intake, panelOpen, send, choose, startIntake, cancelIntake],
  );

  return <ConciergeContext.Provider value={value}>{children}</ConciergeContext.Provider>;
}
