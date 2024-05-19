const url = $request.url;
let header = $request.headers;

if (url.includes("/api/v1/movies/") && url.includes("/play?")) {
  header.authorization =
    "BearereyJhbGciOiJIUzI1NiJ9.eyJpZCI6MTQ0MjQ4MywidXNlcm5hbWUiOiJ5cWMwMDcifQ.l0adZ5o4jao5s9pio7IZpbbdg0HsTdsonzj-cHXh8yw";
  $done({ headers: header });
} else {
  $done({});
}
