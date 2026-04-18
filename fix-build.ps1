# ============================================================
# fix-build.ps1 — Livraria com trilogias + continuar leitura
# Execute: .\fix-build.ps1  (no PowerShell, dentro da pasta do blog)
# ============================================================

Write-Host ">>> Removendo lock files do git..." -ForegroundColor Cyan
Remove-Item -Force .git\index.lock  -ErrorAction SilentlyContinue
Remove-Item -Force .git\HEAD.lock   -ErrorAction SilentlyContinue
Remove-Item -Force .git\COMMIT_EDITMSG.lock -ErrorAction SilentlyContinue

Write-Host ">>> Adicionando arquivos..." -ForegroundColor Cyan
git add lib/ebooks.ts
git add app/livraria/ebooks/page.tsx
git add app/livraria/ebooks/EbookProgressBadge.tsx
git add "app/livraria/ebooks/[slug]/EbookReader.tsx"

Write-Host ""
git status --short

Write-Host ""
Write-Host ">>> Fazendo commit..." -ForegroundColor Cyan
git commit -m "feat(livraria): blocos por trilogia + continuar de onde parou"

if ($LASTEXITCODE -ne 0) { Write-Host "ERRO no commit." -ForegroundColor Red; exit 1 }

Write-Host ">>> Enviando para o GitHub..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Pronto! Deploy iniciado na Vercel." -ForegroundColor Green
    Write-Host "   - Livraria agrupada por trilogia" -ForegroundColor Yellow
    Write-Host "   - Badge de % lido em cada capa" -ForegroundColor Yellow
    Write-Host "   - Toast 'Continuar de onde parou' no leitor" -ForegroundColor Yellow
    Write-Host "   - Barra de progresso na sidebar" -ForegroundColor Yellow
} else {
    Write-Host "ERRO no push." -ForegroundColor Red
}
