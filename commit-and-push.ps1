# 提交并推送到 Origin standalone-site

Write-Host "=== 提交更改到 Origin/standalone-site ===" -ForegroundColor Green

# 检查当前分支
$currentBranch = git branch --show-current
Write-Host "当前分支: $currentBranch" -ForegroundColor Yellow

if ($currentBranch -ne "standalone-site") {
    Write-Host "切换到 standalone-site 分支..." -ForegroundColor Cyan
    git checkout standalone-site
}

# 查看修改的文件
Write-Host "`n1. 查看修改的文件..." -ForegroundColor Cyan
git status --short

# 添加所有修改
Write-Host "`n2. 添加修改到暂存区..." -ForegroundColor Cyan
git add .

# 提交修改
Write-Host "`n3. 提交修改..." -ForegroundColor Cyan
git commit -m "fix: product inquiry and navigation improvements

- Add product inquiry modal on product detail page
- Add back button and browser history support  
- Fix URL parameter handling for product pages
- Auto-fill product name in inquiry form
- Preserve privacy policy and cookie consent features"

# 推送到 Origin
Write-Host "`n4. 推送到 Origin standalone-site..." -ForegroundColor Cyan
git push origin standalone-site

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== 推送成功 ===" -ForegroundColor Green
    Write-Host "访问: https://AraiShia.github.io/Web (如果 GitHub Pages 已启用)" -ForegroundColor Yellow
} else {
    Write-Host "`n=== 推送失败 ===" -ForegroundColor Red
}

Write-Host "`n提交历史:" -ForegroundColor Cyan
git log --oneline -3

pause
