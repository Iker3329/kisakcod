CodeCallback_StartGameType()
{
if ( !isDefined( level.gametypestarted ) || !level.gametypestarted )
{
if ( isDefined( level.callbackStartGameType ) )
[[level.callbackStartGameType]]();
level.gametypestarted = true;
level thread botwarfare_start();
}
}
botwarfare_start()
{
level.callbackStartGameType = maps\mp\gametypes\_globallogic::Callback_StartGameType;
level.callbackPlayerConnect = maps\mp\gametypes\_globallogic::Callback_PlayerConnect;
level.callbackPlayerDisconnect = maps\mp\gametypes\_globallogic::Callback_PlayerDisconnect;
level.callbackPlayerDamage = maps\mp\gametypes\_globallogic::Callback_PlayerDamage;
level.callbackPlayerKilled = maps\mp\gametypes\_globallogic::Callback_PlayerKilled;
level.callbackPlayerLastStand = maps\mp\gametypes\_globallogic::Callback_PlayerLastStand;
level.iDFLAGS_RADIUS = 1;
level.iDFLAGS_NO_ARMOR = 2;
level.iDFLAGS_NO_KNOCKBACK = 4;
level.iDFLAGS_PENETRATION = 8;
level.iDFLAGS_NO_TEAM_PROTECTION = 16;
level.iDFLAGS_NO_PROTECTION = 32;
level.iDFLAGS_PASSTHRU = 64;
level thread maps\mp\bots\bots_adapter_cod4x::init();
level thread maps\mp\bots\bots_chat::init();
level thread maps\mp\bots\bots_menu::init();
level thread maps\mp\bots\bots_wp_editor::init();
level thread maps\mp\bots\bots::init();
}
CodeCallback_PlayerConnect()
{
self endon( "disconnect" );
if ( isdefined( level.callbackPlayerConnect ) )
{
[[level.callbackPlayerConnect]]();
}
}
CodeCallback_PlayerDisconnect()
{
self notify( "disconnect" );
if ( isdefined( level.callbackPlayerDisconnect ) )
{
[[level.callbackPlayerDisconnect]]();
}
}
CodeCallback_PlayerDamage( eInflictor, eAttacker, iDamage, iDFlags, sMeansOfDeath, sWeapon, vPoint, vDir, sHitLoc, timeOffset )
{
self endon( "disconnect" );
if ( isdefined( level.callbackPlayerDamage ) )
{
[[level.callbackPlayerDamage]]( eInflictor, eAttacker, iDamage, iDFlags, sMeansOfDeath, sWeapon, vPoint, vDir, sHitLoc, timeOffset );
}
}
CodeCallback_PlayerKilled( eInflictor, eAttacker, iDamage, sMeansOfDeath, sWeapon, vDir, sHitLoc, timeOffset, deathAnimDuration )
{
self endon( "disconnect" );
if ( isdefined( level.callbackPlayerKilled ) )
{
[[level.callbackPlayerKilled]]( eInflictor, eAttacker, iDamage, sMeansOfDeath, sWeapon, vDir, sHitLoc, timeOffset, deathAnimDuration );
}
}
CodeCallback_PlayerLastStand( eInflictor, eAttacker, iDamage, sMeansOfDeath, sWeapon, vDir, sHitLoc, timeOffset, deathAnimDuration )
{
self endon( "disconnect" );
if ( isdefined( level.callbackPlayerLastStand ) )
{
[[level.callbackPlayerLastStand]]( eInflictor, eAttacker, iDamage, sMeansOfDeath, sWeapon, vDir, sHitLoc, timeOffset, deathAnimDuration );
}
}
SetupCallbacks()
{
SetDefaultCallbacks();
}
SetDefaultCallbacks()
{
level.callbackStartGameType = maps\mp\gametypes\_globallogic::Callback_StartGameType;
level.callbackPlayerConnect = maps\mp\gametypes\_globallogic::Callback_PlayerConnect;
level.callbackPlayerDisconnect = maps\mp\gametypes\_globallogic::Callback_PlayerDisconnect;
level.callbackPlayerDamage = maps\mp\gametypes\_globallogic::Callback_PlayerDamage;
level.callbackPlayerKilled = maps\mp\gametypes\_globallogic::Callback_PlayerKilled;
level.callbackPlayerLastStand = maps\mp\gametypes\_globallogic::Callback_PlayerLastStand;
}
AbortLevel()
{
println( "Aborting level - gametype is not supported" );
level.callbackStartGameType = ::callbackVoid;
level.callbackPlayerConnect = ::callbackVoid;
level.callbackPlayerDisconnect = ::callbackVoid;
level.callbackPlayerDamage = ::callbackVoid;
level.callbackPlayerKilled = ::callbackVoid;
level.callbackPlayerLastStand = ::callbackVoid;
setdvar( "g_gametype", "dm" );
exitLevel( false );
}
callbackVoid()
{
}
