@echo off
curl "http://localhost:3000/api/upload" ^
  -H "Accept: */*" ^
  -H "Accept-Language: en-US,en;q=0.9" ^
  -H "Connection: keep-alive" ^
  -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryPbknL3DypLP3b0UZ" ^
  -b "user_id=UID-919c8ae3; ppId=PP-553fc335; countryCode=IN; countryName=India; user_country=IN; __next_hmr_refresh_hash__=56" ^
  -H "Origin: http://localhost:3000" ^
  -H "Referer: http://localhost:3000/" ^
  -H "Sec-Fetch-Dest: empty" ^
  -H "Sec-Fetch-Mode: cors" ^
  -H "Sec-Fetch-Site: same-origin" ^
  -H "User-Agent: Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36" ^
  -H "sec-ch-ua: \"Chromium\";v=\"148\", \"Google Chrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"" ^
  -H "sec-ch-ua-mobile: ?1" ^
  -H "sec-ch-ua-platform: \"Android\"" ^
  --data-raw "------WebKitFormBoundaryPbknL3DypLP3b0UZ
Content-Disposition: form-data; name=\"file\"; filename=\"screencapture.png\"
Content-Type: image/png

testdata
------WebKitFormBoundaryPbknL3DypLP3b0UZ
Content-Disposition: form-data; name=\"name\"

home
------WebKitFormBoundaryPbknL3DypLP3b0UZ
Content-Disposition: form-data; name=\"folder\"

Web
------WebKitFormBoundaryPbknL3DypLP3b0UZ
Content-Disposition: form-data; name=\"subFolder\"

Design
------WebKitFormBoundaryPbknL3DypLP3b0UZ--"
