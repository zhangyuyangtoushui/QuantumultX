/*
rbavsjk

[rewrite_local]
^https:\/\/(api\.hechuangxinxi\.xyz|jdforrepam\.com)\/api\/(v1\/(ads|startup|users)|v4\/movies\/\w+) url script-response-body https://raw.githubusercontent.com/zhangyuyangtoushui/QuantumultX/main/rbavsjk.js
^https:\/\/(api\.hechuangxinxi\.xyz|jdforrepam\.com)\/api\/v1\/movies\/\w+\/play\? url script-request-header https://raw.githubusercontent.com/zhangyuyangtoushui/QuantumultX/main/rbavsjksj.js

[mitm]
hostname = api.pxxgg.xyz, api.ujvnmkx.cn, api.yijingluowangluo.xyz, api.hechuangxinxi.xyz

*/

  header.authorization =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MzU4NDg3NywidXNlcm5hbWUiOiJjaHhtMTAyNCJ9.pQib789RWlw2N2hrFLVXF-mj125tpw1HXd_t0HbugZc";
  $done({ headers: header });

