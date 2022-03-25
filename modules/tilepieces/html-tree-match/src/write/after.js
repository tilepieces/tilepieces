HTMLTreeMatch.prototype.after = function(el,child){
    var $self = this;
    $self.insertAdjacentElement(el,"after",child);
};