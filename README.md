# Projeto LADS — Mobile (Expo)

Use esta pasta como **raiz do repositório** no GitHub (é o conteúdo que você deve versionar, não uma subpasta dentro de outro projeto).

## O que veio aqui

- Código: `app/`, `components/`, `constants/`, `types/`, `utils/`
- Assets: `assets/` (imagens, fontes)
- Configs: `package.json`, `package-lock.json`, `app.json`, `tsconfig.json`, `babel.config.js`, `metro.config.js`, `tailwind.config.js`, `global.css`, `nativewind-env.d.ts`, `.gitignore`

**Não** inclui `node_modules` (cada um roda `npm install` após clonar).

## Stack

Expo (React Native), TypeScript, NativeWind, Expo Router, Git.

## Rodar

```bash
npm install
npx expo start
```

Use o **Expo Go** no celular para validar o layout.

## Figma

https://www.figma.com/design/dvcA9ZnnGFfQZ3EBTdNEo3/projeto-lads?node-id=0-1

## Subir no GitHub (vazio)

```bash
git init
git add .
git commit -m "chore: marco inicial — projeto Expo LADS"
git branch -M main
git remote add origin <URL_DO_REPO>
git push -u origin main
```

Marco inicial: front-end sem back-end; telas conforme task da disciplina e divisão do time.
