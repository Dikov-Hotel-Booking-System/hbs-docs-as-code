@echo off
setlocal
pushd "%~dp0" || exit /b 1

where /q docker
if errorlevel 1 (
    echo Docker Desktop is required to run the documentation portal.
    goto failed
)

docker info >nul 2>&1
if errorlevel 1 (
    docker desktop start --timeout 120
    if errorlevel 1 goto failed
)

set "HBS_DOCS_BUILD_ID=%RANDOM%-%RANDOM%"
docker compose up --build --wait
if errorlevel 1 goto failed

popd
exit /b 0

:failed
echo The documentation portal could not start. See the Docker output above.
pause
popd
exit /b 1
