var replace = function(cleanvar) {
                        var regExpr = /[^a-zA-Z0-9-. ]/g;
                        var replacevar = cleanvar.replace(regExpr, "");
                        return replacevar
                };

module.exports=replace;
