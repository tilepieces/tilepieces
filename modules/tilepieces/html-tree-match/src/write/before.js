HTMLTreeMatch.prototype.before = function(el,child){
    var $self = this;
    $self.insertAdjacentElement(el,"before",child);
};