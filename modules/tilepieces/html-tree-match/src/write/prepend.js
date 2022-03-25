HTMLTreeMatch.prototype.prepend = function(el,child){
    var $self = this;
    $self.insertAdjacentElement(el,"prepend",child);
};