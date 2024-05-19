const url = $request.url;
let header = $request.headers;

if (url.includes("/api/v1/movies/") && url.includes("/play?")) {
  header.authorization =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MTQ0MjQ4MywidXNlcm5hbWUiOiJ5cWMwMDcifQ.EOCu_lF9TFxeZQ_2SfcwdyiU7cyBESkXiHfWBiP3k9M";
  $done({ headers: header });
} else {
  $done({});
}
