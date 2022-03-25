function paddingURL(url) {
  if (url[0] != "/")
    url = "/" + url;
  if (!url.endsWith("/"))
    url += "/";
  return url;
}