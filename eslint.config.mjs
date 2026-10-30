import next from 'eslint-config-next';

/** Flat config — eslint-config-next v16 exports a native flat-config array. */
const eslintConfig = [
  ...next,
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', '.avatar-venv/**', '.avatar-work/**', '.avatar-models/**', '.claude/worktrees/**', '.data/**'],
  },
];

export default eslintConfig;
