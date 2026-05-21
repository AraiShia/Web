# 提交所有更改

Write-Host "=== 提交所有更改 ===" -ForegroundColor Green

# 检查当前分支
$currentBranch = git branch --show-current
Write-Host "当前分支: $currentBranch" -ForegroundColor Yellow

# 查看修改的文件
Write-Host "`n1. 查看修改的文件..." -ForegroundColor Cyan
git status --short

# 添加所有修改
Write-Host "`n2. 添加修改到暂存区..." -ForegroundColor Cyan
git add .

# 提交修改
Write-Host "`n3. 提交修改..." -ForegroundColor Cyan
git commit -m "feat: improve inquiry modal and legal pages

- Fix inquiry modal to center on screen with proper styling
- Add multi-product inquiry cart support
- Add '+ Inquiry' button on product list
- Create Terms of Service page for B2B wholesale
- Update footer links across all pages
- Fix product page navigation links"

# 推送到 Origin
Write-Host "`n4. 推送到 Origin standalone-site..." -ForegroundColor Cyan
git push origin standalone-site

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== 推送成功 ===" -ForegroundColor Green
} else {
    Write-Host "`n=== 推送失败 ===" -ForegroundColor Red
}

Write-Host "`n提交历史:" -ForegroundColor Cyan
git log --oneline -3

pause
