module.exports.getDate = function(){
  const options = {
    weekday : "long",
    day : "numeric",
    month : "long"
  };
  return new Date().toLocaleDateString("en-US",options);

}

exports.dummy =  function(){
  return "i am dummy function";
}
