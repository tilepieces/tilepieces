function isTextMimeType(mimeType){
    return mimeType && (mimeType.startsWith("text/") ||
        mimeType == "application/json" ||
        mimeType == "application/xml" ||
        mimeType.indexOf("+xml")>-1);
}