"""Batch takes cloned from an approved reference voice, scored for speaker similarity. usage: voice_takes.py jobs.json outdir ref.wav. Resumable.
jobs: [{"id": "<key>_<tag>", "text": <vowelled text>, "seed": int, "cfg": float, "exag": float}]; writes outdir/<id>.wav and results.jsonl. Needs the Chatterbox multilingual model, offline (see neural-setup.sh --voice). Only for a voice that may be used."""
import os,sys,json,time
os.environ.setdefault("HF_HUB_OFFLINE","1")
import numpy as np, torch, torchaudio as ta, librosa
import chatterbox.models.tokenizers.tokenizer as tk
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
tk.add_hebrew_diacritics = lambda text: text
M='/tmp/claude-0/cbmodel/x/root/.cache/huggingface/hub/models--ResembleAI--chatterbox/snapshots/05e904af2b5c7f8e482687a9d7336c5c824467d9'
jobs=json.load(open(sys.argv[1])); out=sys.argv[2]; REF=sys.argv[3]; os.makedirs(out,exist_ok=True)
torch.set_num_threads(4)
model=ChatterboxMultilingualTTS.from_local(M,'cpu')
w,_=librosa.load(REF,sr=16000); ref_e=model.ve.embeds_from_wavs([w],sample_rate=16000,as_spk=True)
def sim(x):
    e=model.ve.embeds_from_wavs([x],sample_rate=16000,as_spk=True)
    return float(np.dot(ref_e,e)/np.linalg.norm(ref_e)/np.linalg.norm(e))
rp=os.path.join(out,'results.jsonl')
done={json.loads(l)['id'] for l in open(rp)} if os.path.exists(rp) else set()
cur=None
for j in jobs:
    if j['id'] in done: continue
    ex=j.get('exag',0.5)
    if ex!=cur: model.prepare_conditionals(REF,exaggeration=ex); cur=ex
    t=time.time(); torch.manual_seed(j['seed'])
    wav=model.generate(j['text'],language_id='he',cfg_weight=j['cfg'],exaggeration=ex).cpu()
    ta.save(os.path.join(out,j['id']+'.wav'),wav,model.sr)
    x=librosa.resample(wav.squeeze(0).numpy(),orig_sr=model.sr,target_sr=16000)
    f0,_,_=librosa.pyin(x,fmin=60,fmax=500,sr=16000); v=f0[~np.isnan(f0)]
    r=dict(id=j['id'],dur=wav.shape[-1]/model.sr,sim=sim(x),f0=float(np.median(v)) if len(v) else None,gen_s=time.time()-t)
    open(rp,'a').write(json.dumps(r)+'\n'); print(r,flush=True)
print('done',flush=True)
