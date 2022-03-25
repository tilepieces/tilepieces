function propertiesMap(properties, inherited) {
  var isInherit = false;
  properties = properties.map((v) => {
    if (typeof v.property === "undefined")
      return;

    var isInherited = inherited && v.property.match(inheritedProperties);
    if (isInherited && !isInherit)
      isInherit = true;
    return {
      property: v.property,
      value: v.value,
      isInherited: !!isInherited
    };
  });
  if (inherited && !isInherit)
    return null;
  return properties;
}