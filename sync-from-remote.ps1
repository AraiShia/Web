# 同步远程 hostinger/standalone-site 到本地
# 以远程仓库为准，覆盖本地修改

Write-Host "=== 同步 hostinger/standalone-site 到本地 ===" -ForegroundColor Green

# 获取远程最新代码
Write-Host "`n1. 获取远程分支最新代码..." -ForegroundColor Cyan
git fetch hostinger standalone-site

# 查看差异
Write-Host "`n2. 查看本地与远程的差异..." -ForegroundColor Cyan
git diff HEAD hostinger/standalone-site --stat

Write-Host "`n3. 重置本地分支到远程状态（以远程为准）..." -ForegroundColor Yellow
Write-Host "   这将丢弃本地修改，使用远程代码" -ForegroundColor Red

$confirm = Read-Host "`n确认要继续吗？ (yes/no)"
if ($confirm -eq "yes") {
    # 重置本地分支到远程状态
    git reset --hard hostinger/standalone-site
    
    Write-Host "`n=== 同步完成 ===" -ForegroundColor Green
    Write-Host "本地代码已与 hostinger/standalone-site 一致" -ForegroundColor Green
} else {
    Write-Host "`n已取消操作" -ForegroundColor Yellow
}

# 显示当前状态
Write-Host "`n当前分支状态:" -ForegroundColor Cyan
git status

git log --oneline -3

pause
