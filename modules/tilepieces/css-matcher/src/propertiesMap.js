function propertiesMap(properties, inherited) {
  properties = properties.map((v) => {
    if (typeof v.property === "undefined")
      return;
    var isInherited = inherited && v.property.match(inheritedProperties);
    return {
      property: v.property,
      value: v.value,
      isInherited: !!isInherited
    };
  });
  return properties;
}