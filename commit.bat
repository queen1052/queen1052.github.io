@echo off
setlocal

REM Stage all changes

echo "pull orgin main"
git pull origin main

echo Staging changes...
git add .

REM Commit changes with a default message or ask for a custom message
set /p commitMessage="Enter commit message: "
if "%commitMessage%"=="" (
    set commitMessage="Automated commit"
)
git commit -m "%commitMessage%"

:push
echo Pushing changes to the remote repository...
git push origin main

if %ERRORLEVEL% neq 0 (
    echo Push failed, attempting to resolve conflicts...
    git pull --rebase origin main
    
    if %ERRORLEVEL% neq 0 (
        echo "Pull failed. Please resolve conflicts manually."
        goto end
    )
    
    REM Retry push after resolving conflicts
    git push origin main
    
    if %ERRORLEVEL% neq 0 (
        echo "Push failed again. Please resolve conflicts manually."
        goto end
    )
)

echo Push successful.

:end
endlocal
pause
