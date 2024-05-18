const url = $request.url;
let header = $request.headers;

if (url.includes("/api/v1/movies/") && url.includes("/play?")) {
  header.authorization =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MzU4NDg3NywidXNlcm5hbWUiOiJjaHhtMTAyNCJ9.pQib789RWlw2N2hrFLVXF-mj125tpw1HXd_t0HbugZc";
  $done({ headers: header });
} else {
  $done({});
}
