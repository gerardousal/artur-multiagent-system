var status = "on";
var jsonBase = JSON.parse('{"from":"control","to":"heater_left","message":{"status":"off"}}');

if (jsonBase.message.status === 'off')
{
  console.log('yes');
}
