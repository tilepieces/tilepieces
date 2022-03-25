HTMLTreeMatch.prototype.append = function(el,child){
    var $self = this;
    $self.insertAdjacentElement(el,"append",child);
};