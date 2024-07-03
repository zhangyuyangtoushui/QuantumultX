/*
rbavsjk

[rewrite_local]
^https:\/\/(api\.hechuangxinxi\.xyz|jdforrepam\.com)\/api\/(v1\/(ads|startup|users)|v4\/movies\/\w+) url script-response-body https://raw.githubusercontent.com/zhangyuyangtoushui/QuantumultX/main/rbavsjk.js
^https:\/\/(api\.hechuangxinxi\.xyz|jdforrepam\.com)\/api\/v1\/movies\/\w+\/play\? url script-request-header https://raw.githubusercontent.com/zhangyuyangtoushui/QuantumultX/main/rbavsjksj.js

[mitm]
hostname = api.pxxgg.xyz, api.ujvnmkx.cn, api.yijingluowangluo.xyz, api.hechuangxinxi.xyz

*/

if (!$response.body) $done({});
const url = $request.url;
let body = $response.body;

if (body) {
  switch (true) {
    // JavDB
    case /^https:\/\/(api\.hechuangxinxi\.xyz|jdforrepam\.com)\/api\/v\d\/\w+/.test(url):
      try {
        let obj = JSON.parse(body);
        if (url.includes("/api/v1/ads")) {
          if (obj?.data?.enabled) {
            obj.data.enabled = false;
          }
          if (obj?.data?.ads) {
            obj.data.ads = {};
          }
        } else if (url.includes("/api/v1/startup")) {
          if (obj?.data?.splash_ad) {
            obj.data.splash_ad.enabled = false;
            obj.data.splash_ad.overtime = 0;
          }
          if (obj?.data?.feedback) {
            obj.data.feedback = {};
          }
          if (obj?.data?.settings?.NOTICE) {
            delete obj.data.settings.NOTICE;
          }
          if (obj?.data?.user) {
  header.authorization =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MzU4NDg3NywidXNlcm5hbWUiOiJjaHhtMTAyNCJ9.pQib789RWlw2N2hrFLVXF-mj125tpw1HXd_t0HbugZc";
  $done({ headers: header });
}
        } else if (url.includes("/api/v1/users")) {
          if (obj?.data?.user) {
  header.authorization =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MzU4NDg3NywidXNlcm5hbWUiOiJjaHhtMTAyNCJ9.pQib789RWlw2N2hrFLVXF-mj125tpw1HXd_t0HbugZc";
  $done({ headers: header });
}
        } else if (url.includes("/api/v4/movies/")) {
  header.authorization =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MzU4NDg3NywidXNlcm5hbWUiOiJjaHhtMTAyNCJ9.pQib789RWlw2N2hrFLVXF-mj125tpw1HXd_t0HbugZc";
  $done({ headers: header });
}
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`JavDB, 出现异常: ` + error);
      }
      break;
    default:
      break;
  }
  $done({ body });
}

