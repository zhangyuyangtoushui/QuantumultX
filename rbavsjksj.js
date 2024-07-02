const url = $request.url;
let header = $request.headers;

if (url.includes("/api/v1/movies/") && url.includes("/play?")) {
  header.authorization =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6OTgwNDk5LCJ1c2VybmFtZSI6Imlvc2hrajEifQ.aSlLcMcGxEtNrsxife9exe0BGs6C4bQHdiBUaYamEAM";
  $done({ headers: header });
} else {
  $done({});
}
