HTMLTreeMatch.prototype.matchHead = function(node){
    var $self = this;
    return [...$self.source.head.children].find(v=>v.isEqualNode(node));
};