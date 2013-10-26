/**
 * Created by ElyDeLaCruz on 10/26/13.
 */

var _ = require('underscore.string');

module.exports = {

    /**
     * Shims _.dasherize to not insert a dash at position 1 in string.
     * @todo Notify lodash/underscore.string authors about dasherize's behaviour
     * @param str {string}
     * @return {string}
     */
    toDashSeparated: function (str) {
        var startsWithDash = false;

        str = _.dasherize(str + '');

        // Make sure dasherize doesn't generate dash in first position
        if (/^\-+/.test(str)) {
            startsWithDash = true;
            do {
                if (!/^\-/.test(str)) {
                    startsWithDash = false;
                }
                else {
                    str = str.substr(1, str.length);
                }
            }
            while (startsWithDash);
        }

        return str;
    },

    /**
     * Returns a dependencies list for use in templates that use requirejs.
     * templates that are parsed by lodash.
     * @param depsArray
     * @returns {}
     */
    buildDepsList: function (depsArray) {
        var out = '', x, i;

        // Concatenate dependencies list
        for (i = 0; i < depsArray.length; i += 1) {
            x = depsArray[i];
            out += '\'' + x + '\'';
            if (i !== depsArray.length - 1) {
                out += ',\n    ';
            }
        }

        return out;
    },

    /**
     * Returns a functions list for use in templates that use requirejs.
     * @param funcsArray {array}
     * @returns {string}
     */
    buildFuncsList: function (funcsArray) {
        var out = '', x, i;

        // Concatenate function list
        for (i = 0; i < funcsArray.length; i += 1) {
            x = funcsArray[i];
            out += _.capitalize(x);
            if (i !== funcsArray.length - 1) {
                out += ', ';
            }
        }
        return out;
    },

    /**
     * Returns string with lower cases first character.
     * @param str {string}
     * @returns {string}
     */
    lcaseFirst: function (str) {
        str = str + "";
        return str.match(/[a-z]/im)[0].toLowerCase() + str.substr(1);
    }
}