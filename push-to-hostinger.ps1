# 推送到 hostinger/standalone-site

Write-Host "=== 推送到 hostinger/standalone-site ===" -ForegroundColor Green

# 检查当前分支
$currentBranch = git branch --show-current
Write-Host "当前分支: $currentBranch" -ForegroundColor Yellow

if ($currentBranch -ne "standalone-site") {
    Write-Host "切换到 standalone-site 分支..." -ForegroundColor Cyan
    git checkout standalone-site
}

# 查看当前状态
Write-Host "`n1. 查看当前状态..." -ForegroundColor Cyan
git status --short

# 确保所有修改已提交
$hasChanges = git status --porcelain
if ($hasChanges) {
    Write-Host "`n⚠️  有未提交的修改，请先提交..." -ForegroundColor Yellow
    git add .
    git commit -m "chore: prepare for hostinger deployment"
}

# 推送到 hostinger
Write-Host "`n2. 推送到 hostinger/standalone-site..." -ForegroundColor Cyan
git push hostinger standalone-site

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== 推送成功 ===" -ForegroundColor Green
    Write-Host "部署地址: https://soinp.com" -ForegroundColor Yellow
    Write-Host "`n注意: Hostinger 可能需要几分钟来部署更新" -ForegroundColor Cyan
} else {
    Write-Host "`n=== 推送失败 ===" -ForegroundColor Red
    Write-Host "请检查网络连接或远程仓库配置" -ForegroundColor Yellow
}

Write-Host "`n远程仓库信息:" -ForegroundColor Cyan
git remote -v

Write-Host "`n提交历史:" -ForegroundColor Cyan
git log --oneline -3

pause
