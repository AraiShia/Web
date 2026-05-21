# 合并远程 hostinger/standalone-site 到本地
# 保留本地新增的隐私政策等文件

Write-Host "=== 合并远程 hostinger/standalone-site 到本地 ===" -ForegroundColor Green

# 获取远程最新代码
Write-Host "`n1. 获取远程分支最新代码..." -ForegroundColor Cyan
git fetch hostinger standalone-site

# 查看差异
Write-Host "`n2. 查看本地与远程的差异..." -ForegroundColor Cyan
git diff HEAD hostinger/standalone-site --stat

Write-Host "`n3. 创建临时分支保存当前工作..." -ForegroundColor Cyan
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$tempBranch = "local-backup-$timestamp"
git branch $tempBranch

Write-Host "`n4. 尝试合并远程代码..." -ForegroundColor Cyan
Write-Host "   如果遇到冲突，需要手动解决" -ForegroundColor Yellow

# 尝试合并
git merge hostinger/standalone-site --no-commit --no-ff

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ 合并成功，无冲突" -ForegroundColor Green
    
    $confirm = Read-Host "`n是否提交合并？ (yes/no)"
    if ($confirm -eq "yes") {
        git commit -m "merge: sync with hostinger/standalone-site

- Merge remote changes from hostinger/standalone-site
- Preserve local additions: privacy policy, cookie consent, inquiry management"
        Write-Host "`n=== 合并完成并提交 ===" -ForegroundColor Green
    } else {
        git merge --abort
        Write-Host "`n已取消合并" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n⚠️  存在冲突，需要手动解决" -ForegroundColor Red
    Write-Host "`n冲突文件:" -ForegroundColor Yellow
    git diff --name-only --diff-filter=U
    
    Write-Host "`n解决冲突后执行:" -ForegroundColor Cyan
    Write-Host "  git add ." -ForegroundColor White
    Write-Host "  git commit -m 'merge: resolved conflicts'" -ForegroundColor White
    
    Write-Host "`n或取消合并:" -ForegroundColor Cyan
    Write-Host "  git merge --abort" -ForegroundColor White
}

Write-Host "`n当前状态:" -ForegroundColor Cyan
git status

Write-Host "`n备份分支: $tempBranch" -ForegroundColor Yellow

pause
