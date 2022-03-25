(() => {
  function addPointer($self) {
    $self.gradientDOM.addEventListener("pointerdown", e => {
      if (!e.target.classList.contains("color-stops") || $self.stopPointDragged)
        return;
      // get new array position
      var bounds = $self.colorStops.getBoundingClientRect();
      var pos = e.clientX - bounds.left;
      var colorStopsOffsets = getPxColorStopsOffsets($self);
      var newColorStopFake = {left: pos, index: -1};
      colorStopsOffsets.push(newColorStopFake);
      colorStopsOffsets.sort((a, b) => a.left - b.left);
      var newColorStopPos = colorStopsOffsets.findIndex(el => el == newColorStopFake);
      var previous = colorStopsOffsets[newColorStopPos - 1];
      var next = colorStopsOffsets[newColorStopPos + 1];
      var newColorStopColor;
      // pos : colorStops.offsetWidth = x : 100
      var percentage = Math.round((pos * 100) / bounds.width);
      if (!previous)
        newColorStopColor = next.color;
      else if (!next)
        newColorStopColor = previous.color;
      else {
        var total = next.left - previous.left;
        var posOverTwoStops = pos - previous.left;
        var ratio = posOverTwoStops / total;
        previous.color = normalizeColor(previous.color);
        next.color = normalizeColor(next.color);
        console.log(ratio, posOverTwoStops, total);
        var c = _interpolateColor(previous.color, next.color, ratio);
        newColorStopColor = "rgba(" + c.join(",") + ")";
      }
      $self.model.colorStops.splice(newColorStopPos, 0, {
        c: newColorStopColor,
        stopPos: percentage + "%"
      });
      $self.model.colorStops.forEach((v, i, a) => {
        v.index = i;
        if (i == a.length - 1)
          v.endPos = null;
        if (i != a.length - 1) {
          v.nextColor = a[i + 1].c;
          var indexPos = i + 1;
          var nextStop = a[indexPos].stopPos;
          calculateEndPos($self, v, nextStop);
        }

      });
      $self.t.set("colorStops", $self.model.colorStops);
      getImageFromModel($self)
    });
  }

  function calculateEndPos($self, stopPos, nextStop) {
    var pos = stopPos.stopPos;
    var thisStopUnit = pos.match(cssUnitsRegex);
    var posNumber = +pos.match(numberRegex)[0];
    if (thisStopUnit[0] != "%") {
      if (thisStopUnit[0] == "px")
        posNumber = (100 * posNumber) / $self.gradientImage.offsetWidth;
      else
        posNumber = (100 * getDimension($self.gradientImage, nextStop)) / $self.gradientImage.offsetWidth;
    }
    var nextStopUnit = nextStop.match(cssUnitsRegex);
    var nextStopNumber = +nextStop.match(numberRegex)[0];
    if (nextStopUnit[0] != "%") {
      if (nextStopUnit[0] == "px")
        nextStopNumber = (100 * nextStopNumber) / $self.gradientImage.offsetWidth;
      else
        nextStopNumber = (100 * getDimension($self.gradientImage, nextStop)) / $self.gradientImage.offsetWidth;
    }
    stopPos.endPos = ((nextStopNumber + posNumber) / 2) + "%";
    console.log(stopPos.stopPos);
  }

  function convertStopToPerc(pos, $self) {
    var posStopUnit = pos.match(cssUnitsRegex);
    var posStopNumber = +pos.match(numberRegex)[0];
    if (posStopUnit[0] != "%") {
      if (posStopUnit[0] == "px")
        posStopNumber = (100 * posStopNumber) / $self.gradientImage.offsetWidth;
      else
        posStopNumber = (100 * getDimension($self.gradientImage, posStopNumber)) / $self.gradientImage.offsetWidth;
    }
    return posStopNumber;
  }

  let cssColors = [
    {
      "name": "AliceBlue",
      "hex": "#F0F8FF"
    },
    {
      "name": "AntiqueWhite",
      "hex": "#FAEBD7"
    },
    {
      "name": "Aqua",
      "hex": "#00FFFF"
    },
    {
      "name": "Aquamarine",
      "hex": "#7FFFD4"
    },
    {
      "name": "Azure",
      "hex": "#F0FFFF"
    },
    {
      "name": "Beige",
      "hex": "#F5F5DC"
    },
    {
      "name": "Bisque",
      "hex": "#FFE4C4"
    },
    {
      "name": "Black",
      "hex": "#000000"
    },
    {
      "name": "BlanchedAlmond",
      "hex": "#FFEBCD"
    },
    {
      "name": "Blue",
      "hex": "#0000FF"
    },
    {
      "name": "BlueViolet",
      "hex": "#8A2BE2"
    },
    {
      "name": "Brown",
      "hex": "#A52A2A"
    },
    {
      "name": "BurlyWood",
      "hex": "#DEB887"
    },
    {
      "name": "CadetBlue",
      "hex": "#5F9EA0"
    },
    {
      "name": "Chartreuse",
      "hex": "#7FFF00"
    },
    {
      "name": "Chocolate",
      "hex": "#D2691E"
    },
    {
      "name": "Coral",
      "hex": "#FF7F50"
    },
    {
      "name": "CornflowerBlue",
      "hex": "#6495ED"
    },
    {
      "name": "Cornsilk",
      "hex": "#FFF8DC"
    },
    {
      "name": "Crimson",
      "hex": "#DC143C"
    },
    {
      "name": "Cyan",
      "hex": "#00FFFF"
    },
    {
      "name": "DarkBlue",
      "hex": "#00008B"
    },
    {
      "name": "DarkCyan",
      "hex": "#008B8B"
    },
    {
      "name": "DarkGoldenRod",
      "hex": "#B8860B"
    },
    {
      "name": "DarkGray",
      "hex": "#A9A9A9"
    },
    {
      "name": "DarkGrey",
      "hex": "#A9A9A9"
    },
    {
      "name": "DarkGreen",
      "hex": "#006400"
    },
    {
      "name": "DarkKhaki",
      "hex": "#BDB76B"
    },
    {
      "name": "DarkMagenta",
      "hex": "#8B008B"
    },
    {
      "name": "DarkOliveGreen",
      "hex": "#556B2F"
    },
    {
      "name": "DarkOrange",
      "hex": "#FF8C00"
    },
    {
      "name": "DarkOrchid",
      "hex": "#9932CC"
    },
    {
      "name": "DarkRed",
      "hex": "#8B0000"
    },
    {
      "name": "DarkSalmon",
      "hex": "#E9967A"
    },
    {
      "name": "DarkSeaGreen",
      "hex": "#8FBC8F"
    },
    {
      "name": "DarkSlateBlue",
      "hex": "#483D8B"
    },
    {
      "name": "DarkSlateGray",
      "hex": "#2F4F4F"
    },
    {
      "name": "DarkSlateGrey",
      "hex": "#2F4F4F"
    },
    {
      "name": "DarkTurquoise",
      "hex": "#00CED1"
    },
    {
      "name": "DarkViolet",
      "hex": "#9400D3"
    },
    {
      "name": "DeepPink",
      "hex": "#FF1493"
    },
    {
      "name": "DeepSkyBlue",
      "hex": "#00BFFF"
    },
    {
      "name": "DimGray",
      "hex": "#696969"
    },
    {
      "name": "DimGrey",
      "hex": "#696969"
    },
    {
      "name": "DodgerBlue",
      "hex": "#1E90FF"
    },
    {
      "name": "FireBrick",
      "hex": "#B22222"
    },
    {
      "name": "FloralWhite",
      "hex": "#FFFAF0"
    },
    {
      "name": "ForestGreen",
      "hex": "#228B22"
    },
    {
      "name": "Fuchsia",
      "hex": "#FF00FF"
    },
    {
      "name": "Gainsboro",
      "hex": "#DCDCDC"
    },
    {
      "name": "GhostWhite",
      "hex": "#F8F8FF"
    },
    {
      "name": "Gold",
      "hex": "#FFD700"
    },
    {
      "name": "GoldenRod",
      "hex": "#DAA520"
    },
    {
      "name": "Gray",
      "hex": "#808080"
    },
    {
      "name": "Grey",
      "hex": "#808080"
    },
    {
      "name": "Green",
      "hex": "#008000"
    },
    {
      "name": "GreenYellow",
      "hex": "#ADFF2F"
    },
    {
      "name": "HoneyDew",
      "hex": "#F0FFF0"
    },
    {
      "name": "HotPink",
      "hex": "#FF69B4"
    },
    {
      "name": "IndianRed ",
      "hex": "#CD5C5C"
    },
    {
      "name": "Indigo  ",
      "hex": "#4B0082"
    },
    {
      "name": "Ivory",
      "hex": "#FFFFF0"
    },
    {
      "name": "Khaki",
      "hex": "#F0E68C"
    },
    {
      "name": "Lavender",
      "hex": "#E6E6FA"
    },
    {
      "name": "LavenderBlush",
      "hex": "#FFF0F5"
    },
    {
      "name": "LawnGreen",
      "hex": "#7CFC00"
    },
    {
      "name": "LemonChiffon",
      "hex": "#FFFACD"
    },
    {
      "name": "LightBlue",
      "hex": "#ADD8E6"
    },
    {
      "name": "LightCoral",
      "hex": "#F08080"
    },
    {
      "name": "LightCyan",
      "hex": "#E0FFFF"
    },
    {
      "name": "LightGoldenRodYellow",
      "hex": "#FAFAD2"
    },
    {
      "name": "LightGray",
      "hex": "#D3D3D3"
    },
    {
      "name": "LightGrey",
      "hex": "#D3D3D3"
    },
    {
      "name": "LightGreen",
      "hex": "#90EE90"
    },
    {
      "name": "LightPink",
      "hex": "#FFB6C1"
    },
    {
      "name": "LightSalmon",
      "hex": "#FFA07A"
    },
    {
      "name": "LightSeaGreen",
      "hex": "#20B2AA"
    },
    {
      "name": "LightSkyBlue",
      "hex": "#87CEFA"
    },
    {
      "name": "LightSlateGray",
      "hex": "#778899"
    },
    {
      "name": "LightSlateGrey",
      "hex": "#778899"
    },
    {
      "name": "LightSteelBlue",
      "hex": "#B0C4DE"
    },
    {
      "name": "LightYellow",
      "hex": "#FFFFE0"
    },
    {
      "name": "Lime",
      "hex": "#00FF00"
    },
    {
      "name": "LimeGreen",
      "hex": "#32CD32"
    },
    {
      "name": "Linen",
      "hex": "#FAF0E6"
    },
    {
      "name": "Magenta",
      "hex": "#FF00FF"
    },
    {
      "name": "Maroon",
      "hex": "#800000"
    },
    {
      "name": "MediumAquaMarine",
      "hex": "#66CDAA"
    },
    {
      "name": "MediumBlue",
      "hex": "#0000CD"
    },
    {
      "name": "MediumOrchid",
      "hex": "#BA55D3"
    },
    {
      "name": "MediumPurple",
      "hex": "#9370DB"
    },
    {
      "name": "MediumSeaGreen",
      "hex": "#3CB371"
    },
    {
      "name": "MediumSlateBlue",
      "hex": "#7B68EE"
    },
    {
      "name": "MediumSpringGreen",
      "hex": "#00FA9A"
    },
    {
      "name": "MediumTurquoise",
      "hex": "#48D1CC"
    },
    {
      "name": "MediumVioletRed",
      "hex": "#C71585"
    },
    {
      "name": "MidnightBlue",
      "hex": "#191970"
    },
    {
      "name": "MintCream",
      "hex": "#F5FFFA"
    },
    {
      "name": "MistyRose",
      "hex": "#FFE4E1"
    },
    {
      "name": "Moccasin",
      "hex": "#FFE4B5"
    },
    {
      "name": "NavajoWhite",
      "hex": "#FFDEAD"
    },
    {
      "name": "Navy",
      "hex": "#000080"
    },
    {
      "name": "OldLace",
      "hex": "#FDF5E6"
    },
    {
      "name": "Olive",
      "hex": "#808000"
    },
    {
      "name": "OliveDrab",
      "hex": "#6B8E23"
    },
    {
      "name": "Orange",
      "hex": "#FFA500"
    },
    {
      "name": "OrangeRed",
      "hex": "#FF4500"
    },
    {
      "name": "Orchid",
      "hex": "#DA70D6"
    },
    {
      "name": "PaleGoldenRod",
      "hex": "#EEE8AA"
    },
    {
      "name": "PaleGreen",
      "hex": "#98FB98"
    },
    {
      "name": "PaleTurquoise",
      "hex": "#AFEEEE"
    },
    {
      "name": "PaleVioletRed",
      "hex": "#DB7093"
    },
    {
      "name": "PapayaWhip",
      "hex": "#FFEFD5"
    },
    {
      "name": "PeachPuff",
      "hex": "#FFDAB9"
    },
    {
      "name": "Peru",
      "hex": "#CD853F"
    },
    {
      "name": "Pink",
      "hex": "#FFC0CB"
    },
    {
      "name": "Plum",
      "hex": "#DDA0DD"
    },
    {
      "name": "PowderBlue",
      "hex": "#B0E0E6"
    },
    {
      "name": "Purple",
      "hex": "#800080"
    },
    {
      "name": "RebeccaPurple",
      "hex": "#663399"
    },
    {
      "name": "Red",
      "hex": "#FF0000"
    },
    {
      "name": "RosyBrown",
      "hex": "#BC8F8F"
    },
    {
      "name": "RoyalBlue",
      "hex": "#4169E1"
    },
    {
      "name": "SaddleBrown",
      "hex": "#8B4513"
    },
    {
      "name": "Salmon",
      "hex": "#FA8072"
    },
    {
      "name": "SandyBrown",
      "hex": "#F4A460"
    },
    {
      "name": "SeaGreen",
      "hex": "#2E8B57"
    },
    {
      "name": "SeaShell",
      "hex": "#FFF5EE"
    },
    {
      "name": "Sienna",
      "hex": "#A0522D"
    },
    {
      "name": "Silver",
      "hex": "#C0C0C0"
    },
    {
      "name": "SkyBlue",
      "hex": "#87CEEB"
    },
    {
      "name": "SlateBlue",
      "hex": "#6A5ACD"
    },
    {
      "name": "SlateGray",
      "hex": "#708090"
    },
    {
      "name": "SlateGrey",
      "hex": "#708090"
    },
    {
      "name": "Snow",
      "hex": "#FFFAFA"
    },
    {
      "name": "SpringGreen",
      "hex": "#00FF7F"
    },
    {
      "name": "SteelBlue",
      "hex": "#4682B4"
    },
    {
      "name": "Tan",
      "hex": "#D2B48C"
    },
    {
      "name": "Teal",
      "hex": "#008080"
    },
    {
      "name": "Thistle",
      "hex": "#D8BFD8"
    },
    {
      "name": "Tomato",
      "hex": "#FF6347"
    },
    {
      "name": "Turquoise",
      "hex": "#40E0D0"
    },
    {
      "name": "Violet",
      "hex": "#EE82EE"
    },
    {
      "name": "Wheat",
      "hex": "#F5DEB3"
    },
    {
      "name": "White",
      "hex": "#FFFFFF"
    },
    {
      "name": "WhiteSmoke",
      "hex": "#F5F5F5"
    },
    {
      "name": "Yellow",
      "hex": "#FFFF00"
    },
    {
      "name": "YellowGreen",
      "hex": "#9ACD32"
    }
  ]

  function degFromAngleDeclaration(dec) {
    var angle = dec.match(angleTypes);
    var number = Number(dec.match(numberRegex)[0]);
    switch (angle[0]) {
      case "rad":
        return Math.round(number * (180 / Math.PI));
      case "turn":
        return number * 360;
      case "grad":
        return Math.round((360 * number) / 400);
    }
    console.log("pos number", number);
    if (number < 0)
      return 180 - Math.abs(number) - (360 * Math.trunc(Math.abs(number) / 360));
    if (number > 360)
      return number - (360 * Math.trunc(number / 360));
    return number;
  }

  function dragStopEnds($self) {
    let pos1, pos2, left, bounds;
    $self.colorInterpolationSlider.addEventListener("pointerdown", e => {
      var colorInterpolationEl = e.target.closest(".color-interpolation");
      if (!colorInterpolationEl ||
        $self.stopPointDragged)
        return;
      $self.stopPointDragged = colorInterpolationEl;
      bounds = $self.gradientDOM.getBoundingClientRect();
      left = $self.stopPointDragged.offsetLeft;
      pos1 = e.clientX;
      $self.gradientDOM.ownerDocument.addEventListener("pointermove", move);
      $self.gradientDOM.ownerDocument.addEventListener("pointerup", up);
    });

    function move(e) {
      pos2 = e.clientX - pos1;
      pos1 = e.clientX;
      left += pos2;
      var percentage = Math.round((left * 100) / bounds.width) + "%";
      var index = +$self.stopPointDragged.dataset.index;
      $self.model.colorStops[index].endPos = percentage;
      getImageFromModel($self)
    }

    function up(e) {
      $self.stopPointDragged = null;
      $self.gradientDOM.ownerDocument.removeEventListener("pointermove", move);
      $self.gradientDOM.ownerDocument.removeEventListener("pointerup", up);
    }

  }

  let padding = 12; //color-stops has padding of 12px;
  function moveColorStops($self) {
    let pos1, pos2, X, left, bounds, movedOffset;
    var colorStopsOffsets = [];
    $self.colorStops.addEventListener("pointerdown", e => {
      if (!e.target.classList.contains("color-stop-dragger") ||
        $self.stopPointDragged)
        return;
      $self.stopPointDragged = e.target.closest(".color-stop");
      $self.model.canAdd = "";
      document.documentElement.classList.add("dragGradient");
      bounds = $self.gradientDOM.getBoundingClientRect();
      left = $self.stopPointDragged.offsetLeft + padding;
      pos1 = e.clientX;
      colorStopsOffsets = getPxColorStopsOffsets($self);
      var index = +$self.stopPointDragged.dataset.index;
      $self.model.colorStops[index].endPos = null;
      if ($self.model.colorStops[index - 1])
        $self.model.colorStops[index - 1].endPos = null;
      e.target.setPointerCapture(e.pointerId);
      //$self.gradientDOM.ownerDocument.addEventListener("pointermove",move);
      //$self.gradientDOM.ownerDocument.addEventListener("pointerup",up);
      e.target.addEventListener("pointermove", move);
      e.target.addEventListener("pointerup", up);
      e.preventDefault();
    });

    function move(e) {
      pos2 = e.clientX - pos1;
      pos1 = e.clientX;
      left += pos2;
      var percentage = Math.round((left * 100) / bounds.width) + "%";
      var index = +$self.stopPointDragged.dataset.index;
      movedOffset = index;
      /* if we are not in the same position than before*/
      var thisStop = colorStopsOffsets.find(v => v.index == index);
      thisStop.left = left;
      colorStopsOffsets.sort((a, b) => a.left - b.left);
      var newColorStopPos = colorStopsOffsets.findIndex(el => el == thisStop);
      if (newColorStopPos != index) {
        var swap1 = JSON.stringify($self.model.colorStops[newColorStopPos]);
        $self.model.colorStops[newColorStopPos] = $self.model.colorStops[index];
        $self.model.colorStops[index] = JSON.parse(swap1);
        var swap2 = JSON.stringify(colorStopsOffsets[newColorStopPos]);
        colorStopsOffsets[newColorStopPos] = colorStopsOffsets[index];
        colorStopsOffsets[index] = JSON.parse(swap2);
        $self.model.colorStops[newColorStopPos].stopPos = percentage;
        //model.colorStops.forEach((v,i)=>v.index=i);
        $self.stopPointDragged.dataset.index = newColorStopPos;
        colorStopsOffsets.forEach((v, i) => v.index = i);
        movedOffset = newColorStopPos;
      } else
        $self.model.colorStops[index].stopPos = percentage;
      getImageFromModel($self)
    }

    function up(e) {
      $self.stopPointDragged = null;
      $self.model.canAdd = "canAdd";
      document.documentElement.classList.remove("dragGradient");
      //$self.gradientDOM.ownerDocument.removeEventListener("pointermove",move);
      //$self.gradientDOM.ownerDocument.removeEventListener("pointerup",up);
      e.target.removeEventListener("pointermove", move);
      e.target.removeEventListener("pointerup", up);
      $self.model.colorStops.forEach((v, i, a) => {
        v.index = i;
        if (i != a.length - 1)
          v.nextColor = a[i + 1].c;
        if (!v.endPos && i != a.length - 1) {
          var indexPos = i + 1;
          var nextStop = a[indexPos].stopPos;
          calculateEndPos($self, v, nextStop);
        }
        if (i == a.length - 1)
          v.endPos = null;
      });
      $self.t.set("", $self.model);
      e.target.releasePointerCapture(e.pointerId)
    }

  }

  function getAngleFromParameters(parameters) {
    var p = parameters;
    var matchSideOrCorner = p.match(sideOrCorner);
    var angle = 180;
    if (matchSideOrCorner) {
      var token = "";
      while (matchSideOrCorner) {
        token += matchSideOrCorner[0];
        p = p.substring(matchSideOrCorner.index + matchSideOrCorner[0].length);
        matchSideOrCorner = p.match(sideOrCorner);
      }
      angle = token ? sideOrCornerMap[token] : 180;
    } else
      angle = degFromAngleDeclaration(parameters);
    return angle;
  }

  function getDimension(el, cssString, property = "width") {
    var old = el.style.getPropertyValue(property);
    var win = el.ownerDocument.defaultView;
    el.style.setProperty(property, cssString, "important");
    var px = +(win.getComputedStyle(el, null)[property].replace("px", ""));
    el.style.setProperty(property, old);
    return px;
  }

  let colorRegexFunctions = "rgb\\([^)]*\\)|rgba\\([^)]*\\)|#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})|hsl\\([^)]*\\)|hsla\\([^)]*\\)";
  let cssColorRegex = cssColors.map(v => v.name).join("|");
  let colorRegex = new RegExp(colorRegexFunctions + "|" + cssColorRegex, "i");

  function getGradientStops(arr, gradientType) {
    var parameters = "";
    if (arr[0] && !arr[0].match(colorRegex)) {
      parameters = arr[0];
      arr.splice(0, 1);
    } else {
      if (gradientType == "linear-gradient") {
        parameters = "180deg"
      }
    }
    var colorStops = arr.reduce((acc, v, i, a) => {
      var cMatch = v.trim().match(colorRegex);
      var color = cMatch && cMatch[0];
      if (color) {
        var isNameColor = cssColors.find(cssc => cssc.name.toLocaleLowerCase() == color.toLowerCase());
        if (isNameColor)
          color = isNameColor.hex;
      }
      var stop = cMatch ? v.replace(cMatch[0], "").trim() : v.trim();
      var endPos = null;
      if (!color) {
        acc[acc.length - 1].endPos = stop;
        return acc;
      }
      if (!stop) {
        if (i == 0)
          stop = "0%";
        else if (i == a.length - 1)
          stop = "100%";
      }
      acc.push({c: color, stopPos: stop, endPos, index: acc.length});
      return acc;
    }, []);
    return {parameters, colorStops, gradientType}
  }

  function getImageFromModel($self) {
    var model = $self.model;
    var func = model.gradientType;
    var p = model.parameters ? model.parameters + "," : "";
    var colorStopsForG = model.colorStops.map((cs, i, a) => cs.c + " " + cs.stopPos +
      (cs.endPos && i != a.length - 1 ? "," + cs.endPos : "")).join(",");
    var dec = func + "(" + p + colorStopsForG + ")";
    model.declarationForView = `linear-gradient(90deg,${colorStopsForG})`;
    $self.t.set("declarationForView", model.declarationForView);
    $self.gradientDOM.dispatchEvent(new CustomEvent("gradient-change", {
      detail: dec
    }));
  }

  function getPxColorStopsOffsets($self) {
    var colorStops = $self.colorStops.querySelectorAll(".color-stop");
    return [...colorStops].map(cs => {
      return {
        left: cs.offsetLeft,
        index: cs.dataset.index,
        color: cs.dataset.color
      }
    }).sort((a, b) => a.left - b.left);
  }

  function handleParamsChange($self) {
    $self.parameters.addEventListener("input", e => {
      $self.model.parameters = $self.parameters.innerText;
      getImageFromModel($self);
      if ($self.model.gradientType == "linear-gradient" ||
        $self.model.gradientType == "repeating-linear-gradient") {
        var newAngle = getAngleFromParameters($self.model.parameters)
        $self.knob.set(newAngle);
      }
    });
    $self.gradientDOM.addEventListener("gradientType", e => {
      $self.model.parameters = "";
      $self.parameters.textContent = "";
      $self.model.gradientType = e.detail.target.value;
      $self.model.knobIsVisible = $self.model.gradientType == "linear-gradient" ||
        $self.model.gradientType == "repeating-linear-gradient";
      $self.t.set("", $self.model);
      getImageFromModel($self)
    });
    $self.colorStops.addEventListener("click", e => {
      if (!e.target.classList.contains("color-stop-button"))
        return;
      var color = e.target.style.backgroundColor;
      var index = +e.target.dataset.index;
      opener.tilepieces.colorPicker(color).onChange(c => {
        var newColor = c.rgba[3] < 1 ? c.rgbaString : c.rgbString;
        $self.model.colorStops[index].c = newColor;
        if (index > 0)
          $self.model.colorStops[index - 1].nextColor = newColor;
        $self.t.set("", $self.model);
        getImageFromModel($self);
      })
    })
  }

  function hexToRGBA(hex) {
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      var c;
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return [(c >> 16) & 255, (c >> 8) & 255, c & 255, 1];
    }
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16),
      a = hex.slice(7, 9) ? parseInt(hex.slice(7, 9), 16) : 255;

    return [r, g, b, (a / 255)];
    //return "rgba(" + r + ", " + g + ", " + b + ", " + (a/255) + ")";
  }

// https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
  function hslToRgba(h, s, l, a = 1) {
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      var hue2rgb = function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a];
  }

// https://codepen.io/njmcode/pen/axoyD?editors=0010
// Interpolates two [r,g,b] colors and returns an [r,g,b] of the result
// Taken from the awesome ROT.js roguelike dev library at
// https://github.com/ondras/rot.js
  var _interpolateColor = function (color1, color2, factor) {
    if (arguments.length < 3) {
      factor = 0.5;
    }
    var result = color1.slice();
    for (var i = 0; i < 3; i++)
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    result[3] = color1[3];
    if (color1[3] != color2[3])
      result[3] = (color1[3] + color2[3]) * factor;
    return result;
  };

  function DOMKnob(DOMel) {
    var $self = this;
    $self.knob = DOMel;
    $self.centerX = 0;
    $self.centerY = 0;
    $self.UP = false;
    $self.changeCbs = [];
    $self.onChange = cb => {
      $self.changeCbs.push(cb);
    };
    $self.set = degrees => {
      $self.knob.style.transform = "rotate(" + degrees + "deg)";
    }
    $self.bounds = {};

    function calculateAngle(x, y) {
      return Math.atan((x - $self.centerX) / (y - $self.centerY));// * (180 / Math.PI)
    }

    function start(e) {
      $self.UP = true;
      $self.bounds = $self.knob.getBoundingClientRect();
      $self.centerX = $self.bounds.left + ($self.bounds.width / 2);
      $self.centerY = $self.bounds.top + ($self.bounds.height / 2);
      knobRotation(e);
      $self.knob.ownerDocument.addEventListener("pointermove", knobRotation);
      $self.knob.ownerDocument.addEventListener("pointerup", release);
    }

    function knobRotation(e) {
      if (!$self.UP)
        return;
      var angle = calculateAngle(e.clientX, e.clientY);
      var topRight = e.clientX >= $self.centerX && e.clientY < $self.centerY;
      var bottomRight = e.clientX >= $self.centerX && e.clientY >= $self.centerY;
      var bottomLeft = e.clientX < $self.centerX && e.clientY >= $self.centerY;
      var topLeft = e.clientX < $self.centerX && e.clientY < $self.centerY;
      var angleInDeg = Math.round(angle * (180 / Math.PI));
      if (topRight)
        angleInDeg = -(angleInDeg);
      else if (bottomRight)
        angleInDeg = 180 - angleInDeg;
      else if (bottomLeft)
        angleInDeg = 180 - angleInDeg;
      else if (topLeft)
        angleInDeg = 360 - angleInDeg;
      $self.knob.style.transform = "rotate(" + angleInDeg + "deg)";
      $self.changeCbs.forEach(cb => cb(angleInDeg));

    }

    function release() {
      if ($self.UP)
        $self.UP = false;
      $self.knob.ownerDocument.removeEventListener("pointermove", knobRotation);
      $self.knob.ownerDocument.removeEventListener("pointerup", release);
    }

    $self.knob.addEventListener("pointerdown", start);
    return $self;
  }

  const rgbaRegex = /rgb.?\(([^)]*)\)/;
  const hslRegex = /hsl.?\(([^)]*)\)/;
  const hexRegex = /#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})/;
  const numberRegex = /[+-]?\d+(?:\.\d+)?|[+-]?\.\d+?/;
  const numberRegexGlobal = /[+-]?\d+(?:\.\d+)?|[+-]?\.\d+?/g;
  const angleTypes = /deg(\s|$)|rad(\s|$)|turn(\s|$)|grad(\s|$)/;
  const numAndValueRegex = /([+-]?\d+(?:\.\d+)?|[+-]?\.\d+?)(em|ex|ch|rem|vh|vw|vmin|vmax|cm|mm|in|px|pt|pc|fr|%)/;
  const cssUnitsRegex = /em|ex|ch|rem|vh|vw|vmin|vmax|cm|mm|in|px|pt|pc|fr|%/;
//let colorRegex = /rgb\([^)]*\)|rgba\([^)]*\)|#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b|hsl\([^)]*\)|hsla\([^)]*\)/g;
  let parenthesisToAvoid = /rgb\([^)]*\)|rgba\([^)]*\)|hsl\([^)]*\)|hsla\([^)]*\)|url\([^)]*\)/;
  let sideOrCorner = /top|bottom|left|right/;
  let sideOrCornerMap = {
    top: 0,
    left: 270,
    right: 90,
    bottom: 180,
    topleft: 315,
    topright: 45,
    bottomright: 135,
    bottomleft: 225
  };
  let opener = window.opener || window.parent || window.top;
  let app = opener.app;
  let TT = opener.TT;

  function GradientView(view, model, noInputCss) {
    this.gradientDOM = view;
    this.noInputCss = noInputCss;
    this.gradientImage = this.gradientDOM.querySelector(".gradient-image");
    this.colorStops = this.gradientDOM.querySelector(".color-stops");
    this.colorInterpolationSlider = this.gradientDOM.querySelector(".color-interpolation-slider");
    this.parameters = this.gradientDOM.querySelector(".parameters");
    var knobEl = this.gradientDOM.querySelector(".knob");
    this.knob = new DOMKnob(knobEl);
    this.model = model ? adjustModel(model, this) : {
      parameters: "",
      colorStops: [],
      declarationForView: "",
      gradientType: ""
    };
    this.parameters.textContent = this.model.parameters;
    this.stopPointDragged = false;
    this.t = new TT(view, this.model);
    removePointerEvents(this);
    addPointer(this);
    moveColorStops(this);
    dragStopEnds(this);
    handleParamsChange(this);
    this.knob.onChange(degree => {
      if (!this.model.declarationForView)
        return;
      this.t.set("parameters", degree + "deg");
      this.parameters.dispatchEvent(new Event("blur"));
      //this.parameters.textContent = degree + "deg";
      getImageFromModel(this)
    });
    return this;
  };
  window.gradientView = function (view, model) {
    return new GradientView(view, model)
  };
  let linearGradientRegex = /linear-gradient\(([^)]*)\)|repeting-linear-gradient\(([^)]*)\)|radial-gradient\(([^)]*)\)|repeting-radial-gradient\(([^)]*)\)/;
  let gradientsName = /linear-gradient|repeting-linear-gradient|radial-gradient|repeting-radial-gradient/;

  function matchGradients(cssBackgroundStyle) {
    // first, change all rgb[a],hls[a] removing commas and parenthesis with another character
    var s = cssBackgroundStyle;
    var m = s.match(parenthesisToAvoid);
    var st = 0;
    while (m) {
      cssBackgroundStyle = cssBackgroundStyle.substring(0, st + m.index) +
        m[0].replace(/\(/g, "[").replace(/\)/g, "]").replace(/,/g, "?") + cssBackgroundStyle.substring(st + m.index + m[0].length);
      st = st + m.index + m[0].length;
      s = s.substring(m.index + m[0].length);
      m = s.match(parenthesisToAvoid);
    }
    // then match gradients;
    var gradients = [];
    var gradient = cssBackgroundStyle.match(linearGradientRegex);
    while (gradient) {
      s = gradient[1];
      var g = gradient[1].replace(/\[/g, "(").replace(/]/g, ")");
      var gradientParameters = g.split(",").map(v => v.replace(/\?/g, ","));
      var gradientType = gradient[0].match(gradientsName)[0];
      var gradientDecompiled = getGradientStops(gradientParameters, gradientType);
      gradientDecompiled.declarationForView = `linear-gradient(90deg,${gradientParameters.join(",")})`;
      gradients.push(gradientDecompiled);
      cssBackgroundStyle = cssBackgroundStyle.substring(gradient.index + gradient[0].length);
      gradient = cssBackgroundStyle.match(linearGradientRegex);
    }
    return gradients
  }

  window.matchGradients = matchGradients;

  function normalizeColor(c) {
    if (!c.match(rgbaRegex)) {
      if (c.match(hexRegex))
        c = hexToRGBA(c);
      if (c.match(hslRegex))
        c = hslToRgba(c.match(numberRegexGlobal).map(n => +n));
    } else {
      c = c.match(numberRegexGlobal).map(n => +n);
      if (typeof c[3] === "undefined")
        c[3] = 1;
    }
    return c;
  }

  function removePointerEvents($self) {
    $self.colorStops.addEventListener("pointerdown", e => {
      if (!e.target.classList.contains("remove-color-stop") || $self.stopPointDragged)
        return;
      $self.model.colorStops.splice(+e.target.dataset.index, 1);
      $self.model.colorStops.forEach((v, i, a) => {
        v.index = i;
        if (i == a.length - 1)
          v.endPos = null;
        if (i != a.length - 1) {
          v.nextColor = a[i + 1].c;
          var indexPos = i + 1;
          var nextStop = a[indexPos].stopPos;
          calculateEndPos($self, v, nextStop);
        }
      });
      $self.t.set("colorStops", $self.model.colorStops);
      getImageFromModel($self)
    });
  }

  function adjustModel(newModel, $self) {
    if (newModel.gradientType == "linear-gradient" || newModel.gradientType == "repeating-linear-gradient") {
      newModel.knobIsVisible = true;
      var angle = getAngleFromParameters(newModel.parameters);
      newModel.linearGradientAngle = angle;
      $self.knob.set(angle)
    } else { // isRadial
      newModel.knobIsVisible = false;
    }
    // fill colorStops
    newModel.colorStops = newModel.colorStops.map((v, i, a) => {
      if (!v.stopPos) {
        var indexFindPrevious = i - 1;
        var previousStop = a[indexFindPrevious];
        while (!previousStop.stopPos && indexFindPrevious > -1) {
          indexFindPrevious--;
          previousStop = a[indexFindPrevious]
        }
        var perc1 = convertStopToPerc(previousStop.stopPos, $self);
        var indexFindNext = i + 1;
        var nextStop = a[indexFindNext];
        var nextStopsWithout = 1;
        while (!nextStop.stopPos && indexFindNext > -1) {
          indexFindNext++;
          nextStopsWithout++;
          nextStop = a[indexFindNext];
        }
        var total = nextStopsWithout + 1;
        var perc2 = convertStopToPerc(nextStop.stopPos, $self);
        v.stopPos = (perc1 + ((perc2 - perc1) / total)) + "%";
      }
      return v;
    })
      .map((v, i, a) => {// fill colorEnd
        if (!v.endPos && i != a.length - 1) {
          var indexPos = i + 1;
          var nextStop = a[indexPos].stopPos;
          calculateEndPos($self, v, nextStop);
        }
        if (i != a.length - 1)
          v.nextColor = a[i + 1].c;
        return v;
      });
    newModel.canAdd = "canAdd";
    return newModel;
  }

  GradientView.prototype.set = function (newModel) {
    var $self = this;
    this.model = adjustModel(newModel, $self);
    this.t.set("", this.model);
    //if($self.parameters.ownerDocument.activeElement != $self.parameters)
    $self.parameters.textContent = $self.model.parameters;
    !this.noInputCss && inputCss(this.gradientDOM);
  }

})();