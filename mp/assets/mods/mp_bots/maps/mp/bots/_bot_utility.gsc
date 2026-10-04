#include common_scripts\utility;
#include maps\mp\_utility;
#include maps\mp\gametypes\_hud_util;
wait_for_builtins()
{
for ( i = 0; i < 20; i++ )
{
if ( isdefined( level.bot_builtins ) )
{
return true;
}
if ( i < 18 )
{
waittillframeend;
}
else
{
wait 0.05;
}
}
return false;
}
BotBuiltinPrintConsole( s )
{
if ( isdefined( level.bot_builtins ) && isdefined( level.bot_builtins[ "printconsole" ] ) )
{
[[ level.bot_builtins[ "printconsole" ] ]]( s );
}
}
BotBuiltinFileWrite( file, contents, mode )
{
if ( isdefined( level.bot_builtins ) && isdefined( level.bot_builtins[ "filewrite" ] ) )
{
[[ level.bot_builtins[ "filewrite" ] ]]( file, contents, mode );
}
}
BotBuiltinFileRead( file )
{
if ( isdefined( level.bot_builtins ) && isdefined( level.bot_builtins[ "fileread" ] ) )
{
return [[ level.bot_builtins[ "fileread" ] ]]( file );
}
return undefined;
}
BotBuiltinFileExists( file )
{
if ( isdefined( level.bot_builtins ) && isdefined( level.bot_builtins[ "fileexists" ] ) )
{
return [[ level.bot_builtins[ "fileexists" ] ]]( file );
}
return false;
}
BotBuiltinBotAction( action )
{
if ( isdefined( level.bot_builtins ) && isdefined( level.bot_builtins[ "botaction" ] ) )
{
self [[ level.bot_builtins[ "botaction" ] ]]( action );
}
}
BotBuiltinBotStop()
{
if ( isdefined( level.bot_builtins ) && isdefined( level.bot_builtins[ "botstop" ] ) )
{
self [[ level.bot_builtins[ "botstop" ] ]]();
}
}
BotBuiltinBotMovement( forward, right )
{
if ( isdefined( level.bot_builtins ) && isdefined( level.bot_builtins[ "botmovement" ] ) )
{
self [[ level.bot_builtins[ "botmovement" ] ]]( forward, right );
}
}
BotBuiltinBotMoveTo( where )
{
if ( isdefined( level.bot_builtins ) && isdefined( level.bot_builtins[ "botmoveto" ] ) )
{
self [[ level.bot_builtins[ "botmoveto" ] ]]( where );
}
}
BotBuiltinBotMeleeParams( yaw, dist )
{
if ( isdefined( level.bot_builtins ) && isdefined( level.bot_builtins[ "botmeleeparams" ] ) )
{
self [[ level.bot_builtins[ "botmeleeparams" ] ]]( yaw, dist );
}
}
BotBuiltinIsBot()
{
if ( isdefined( level.bot_builtins ) && isdefined( level.bot_builtins[ "isbot" ] ) )
{
return self [[ level.bot_builtins[ "isbot" ] ]]();
}
return false;
}
BotBuiltinFileOpen( file, mode )
{
if ( isdefined( level.bot_builtins ) && isdefined( level.bot_builtins[ "fs_fopen" ] ) )
{
return [[ level.bot_builtins[ "fs_fopen" ] ]]( file, mode );
}
return 0;
}
BotBuiltinFileClose( fh )
{
if ( isdefined( level.bot_builtins ) && isdefined( level.bot_builtins[ "fs_fclose" ] ) )
{
[[ level.bot_builtins[ "fs_fclose" ] ]]( fh );
}
}
BotBuiltinReadLine( fh )
{
if ( isdefined( level.bot_builtins ) && isdefined( level.bot_builtins[ "fs_readline" ] ) )
{
return [[ level.bot_builtins[ "fs_readline" ] ]]( fh );
}
return undefined;
}
BotBuiltinWriteLine( fh, contents )
{
if ( isdefined( level.bot_builtins ) && isdefined( level.bot_builtins[ "fs_writeline" ] ) )
{
[[ level.bot_builtins[ "fs_writeline" ] ]]( fh, contents );
}
}
is_host()
{
return ( isdefined( self.pers[ "bot_host" ] ) && self.pers[ "bot_host" ] );
}
doHostCheck()
{
self.pers[ "bot_host" ] = false;
if ( self is_bot() )
{
return;
}
result = false;
if ( getdvar( "bots_main_firstIsHost" ) != "0" )
{
BotBuiltinPrintConsole( "WARNING: bots_main_firstIsHost is enabled" );
if ( getdvar( "bots_main_firstIsHost" ) == "1" )
{
setdvar( "bots_main_firstIsHost", self getguid() );
}
if ( getdvar( "bots_main_firstIsHost" ) == self getguid() + "" )
{
result = true;
}
}
DvarGUID = getdvar( "bots_main_GUIDs" );
if ( DvarGUID != "" )
{
guids = strtok( DvarGUID, "," );
for ( i = 0; i < guids.size; i++ )
{
if ( self getguid() + "" == guids[ i ] )
{
result = true;
}
}
}
if ( !result )
{
return;
}
self.pers[ "bot_host" ] = true;
}
is_bot()
{
return self BotBuiltinIsBot();
}
BotSetStance( stance )
{
switch ( stance )
{
case "stand":
self maps\mp\bots\_bot_internal::stand();
break;
case "crouch":
self maps\mp\bots\_bot_internal::crouch();
break;
case "prone":
self maps\mp\bots\_bot_internal::prone();
break;
}
}
BotPressAttack( time )
{
self maps\mp\bots\_bot_internal::pressFire( time );
}
BotPressADS( time )
{
self maps\mp\bots\_bot_internal::pressADS( time );
}
BotPressUse( time )
{
self maps\mp\bots\_bot_internal::use( time );
}
BotPressFrag( time )
{
self maps\mp\bots\_bot_internal::frag( time );
}
BotPressSmoke( time )
{
self maps\mp\bots\_bot_internal::smoke( time );
}
BotGetRandom()
{
return self.bot.rand;
}
BotGetTargetRandom()
{
if ( !isdefined( self.bot.target ) )
{
return undefined;
}
return self.bot.target.rand;
}
IsBotFragging()
{
return self.bot.isfraggingafter;
}
IsBotSmoking()
{
return self.bot.issmokingafter;
}
IsBotSprinting()
{
return self.bot.issprinting;
}
IsBotReloading()
{
return self.bot.isreloading;
}
IsBotKnifing()
{
return self.bot.isknifingafter;
}
IsPlayerModelOK()
{
return ( isdefined( self.bot_model_fix ) );
}
BotFreezeControls( what )
{
self.bot.isfrozen = what;
if ( what )
{
self notify( "kill_goal" );
}
}
BotIsFrozen()
{
return self.bot.isfrozen;
}
BotStopMoving( what )
{
self.bot.stop_move = what;
if ( what )
{
self notify( "kill_goal" );
}
}
BotNotifyBotEvent( msg, a, b, c, d, e, f, g )
{
self notify( "bot_event", msg, a, b, c, d, e, f, g );
}
HasScriptGoal()
{
return ( isdefined( self GetScriptGoal() ) );
}
GetScriptGoal()
{
return self.bot.script_goal;
}
SetScriptGoal( goal, dist )
{
if ( !isdefined( dist ) )
{
dist = 16;
}
self.bot.script_goal = goal;
self.bot.script_goal_dist = dist;
waittillframeend;
self notify( "new_goal_internal" );
self notify( "new_goal" );
}
ClearScriptGoal()
{
self SetScriptGoal( undefined, 0 );
}
HasPriorityObjective()
{
return self.bot.prio_objective;
}
SetPriorityObjective()
{
self.bot.prio_objective = true;
self notify( "kill_goal" );
}
ClearPriorityObjective()
{
self.bot.prio_objective = false;
self notify( "kill_goal" );
}
SetScriptAimPos( pos )
{
self.bot.script_aimpos = pos;
}
ClearScriptAimPos()
{
self SetScriptAimPos( undefined );
}
GetScriptAimPos()
{
return self.bot.script_aimpos;
}
HasScriptAimPos()
{
return isdefined( self GetScriptAimPos() );
}
SetAttacker( att )
{
self.bot.target_this_frame = att;
}
SetScriptEnemy( enemy, offset )
{
self.bot.script_target = enemy;
self.bot.script_target_offset = offset;
}
ClearScriptEnemy()
{
self SetScriptEnemy( undefined, undefined );
}
getThreat()
{
if ( !isdefined( self.bot.target ) )
{
return undefined;
}
return self.bot.target.entity;
}
HasScriptEnemy()
{
return ( isdefined( self.bot.script_target ) );
}
HasThreat()
{
return ( isdefined( self getThreat() ) );
}
isDefusing()
{
return ( isdefined( self.isdefusing ) && self.isdefusing );
}
isPlanting()
{
return ( isdefined( self.isplanting ) && self.isplanting );
}
inLastStand()
{
return ( isdefined( self.laststand ) && self.laststand );
}
isBombCarrier()
{
return ( isdefined( self.isbombcarrier ) && self.isbombcarrier );
}
isInUse()
{
return ( isdefined( self.inuse ) && self.inuse );
}
IsStunned()
{
return ( isdefined( self.concussionendtime ) && self.concussionendtime > gettime() );
}
isArtShocked()
{
return ( isdefined( self.beingartilleryshellshocked ) && self.beingartilleryshellshocked );
}
getValidTube()
{
weaps = self getweaponslist();
for ( i = 0; i < weaps.size; i++ )
{
weap = weaps[ i ];
if ( !self getammocount( weap ) )
{
continue;
}
if ( issubstr( weap, "gl_" ) && !issubstr( weap, "_gl_" ) )
{
return weap;
}
}
return undefined;
}
getValidGrenade()
{
grenadeTypes = [];
grenadeTypes[ grenadeTypes.size ] = "frag_grenade_mp";
grenadeTypes[ grenadeTypes.size ] = "smoke_grenade_mp";
grenadeTypes[ grenadeTypes.size ] = "flash_grenade_mp";
grenadeTypes[ grenadeTypes.size ] = "concussion_grenade_mp";
possibles = [];
for ( i = 0; i < grenadeTypes.size; i++ )
{
if ( !self hasweapon( grenadeTypes[ i ] ) )
{
continue;
}
if ( !self getammocount( grenadeTypes[ i ] ) )
{
continue;
}
possibles[ possibles.size ] = grenadeTypes[ i ];
}
return random( possibles );
}
getWinningTeam()
{
if ( maps\mp\gametypes\_globallogic::getgamescore( "allies" ) == maps\mp\gametypes\_globallogic::getgamescore( "axis" ) )
{
winner = "tie";
}
else if ( maps\mp\gametypes\_globallogic::getgamescore( "allies" ) > maps\mp\gametypes\_globallogic::getgamescore( "axis" ) )
{
winner = "allies";
}
else
{
winner = "axis";
}
return winner;
}
getBaseWeaponName( weap )
{
return strtok( weap, "_" )[ 0 ];
}
WeaponIsFullAuto( weap )
{
weaptoks = strtok( weap, "_" );
return isdefined( weaptoks[ 0 ] ) && isstring( weaptoks[ 0 ] ) && isdefined( level.bots_fullautoguns[ weaptoks[ 0 ] ] );
}
getEyeHeight()
{
stance = self getstance();
if ( self inLastStand() || stance == "prone" )
{
return 11;
}
if ( stance == "crouch" )
{
return 40;
}
return 60;
}
getEyePos()
{
return self.origin + ( 0, 0, self getEyeHeight() );
}
waittill_either_return_( str1, str2 )
{
self endon( str1 );
self waittill( str2 );
return true;
}
waittill_either_return( str1, str2 )
{
if ( !isdefined( self waittill_either_return_( str1, str2 ) ) )
{
return str1;
}
return str2;
}
waittill_either( not, not1 )
{
self endon( not );
self waittill( not1 );
}
allowClassChoice()
{
return true;
}
allowTeamChoice()
{
return true;
}
waittill_any_timeout( timeOut, string1, string2, string3, string4, string5 )
{
if ( ( !isdefined( string1 ) || string1 != "death" ) && ( !isdefined( string2 ) || string2 != "death" ) && ( !isdefined( string3 ) || string3 != "death" ) && ( !isdefined( string4 ) || string4 != "death" ) && ( !isdefined( string5 ) || string5 != "death" ) )
{
self endon( "death" );
}
ent = spawnstruct();
if ( isdefined( string1 ) )
{
self thread waittill_string( string1, ent );
}
if ( isdefined( string2 ) )
{
self thread waittill_string( string2, ent );
}
if ( isdefined( string3 ) )
{
self thread waittill_string( string3, ent );
}
if ( isdefined( string4 ) )
{
self thread waittill_string( string4, ent );
}
if ( isdefined( string5 ) )
{
self thread waittill_string( string5, ent );
}
ent thread _timeout( timeOut );
ent waittill( "returned", msg );
ent notify( "die" );
return msg;
}
_timeout( delay )
{
self endon( "die" );
wait( delay );
self notify( "returned", "timeout" );
}
isItemUnlocked( what, lvl )
{
switch ( what )
{
case "ak47":
return true;
case "ak74u":
return ( lvl >= 28 );
case "barrett":
return ( lvl >= 49 );
case "dragunov":
return ( lvl >= 22 );
case "g3":
return ( lvl >= 25 );
case "g36c":
return ( lvl >= 37 );
case "m1014":
return ( lvl >= 31 );
case "m14":
return ( lvl >= 46 );
case "m16":
return true;
case "m21":
return ( lvl >= 7 );
case "m4":
return ( lvl >= 10 );
case "m40a3":
return true;
case "m60e4":
return ( lvl >= 19 );
case "mp44":
return ( lvl >= 52 );
case "mp5":
return true;
case "p90":
return ( lvl >= 40 );
case "rpd":
return true;
case "saw":
return true;
case "skorpion":
return true;
case "uzi":
return ( lvl >= 13 );
case "winchester1200":
return true;
case "remington700":
return ( lvl >= 34 );
case "beretta":
return true;
case "colt45":
return ( lvl >= 16 );
case "deserteagle":
return ( lvl >= 43 );
case "deserteaglegold":
return ( lvl >= 55 );
case "usp":
return true;
case "specialty_bulletdamage":
return true;
case "specialty_armorvest":
return true;
case "specialty_fastreload":
return ( lvl >= 20 );
case "specialty_rof":
return ( lvl >= 29 );
case "specialty_twoprimaries":
return ( lvl >= 38 );
case "specialty_gpsjammer":
return ( lvl >= 11 );
case "specialty_explosivedamage":
return true;
case "specialty_longersprint":
return true;
case "specialty_bulletaccuracy":
return true;
case "specialty_pistoldeath":
return ( lvl >= 8 );
case "specialty_grenadepulldeath":
return ( lvl >= 17 );
case "specialty_bulletpenetration":
return true;
case "specialty_holdbreath":
return ( lvl >= 26 );
case "specialty_quieter":
return ( lvl >= 44 );
case "specialty_parabolic":
return ( lvl >= 35 );
case "specialty_specialgrenade":
return true;
case "specialty_weapon_rpg":
return true;
case "specialty_weapon_claymore":
return ( lvl >= 23 );
case "specialty_fraggrenade":
return ( lvl >= 41 );
case "specialty_extraammo":
return ( lvl >= 32 );
case "specialty_detectexplosive":
return ( lvl >= 14 );
case "specialty_weapon_c4":
return true;
default:
return true;
}
}
getweaponclass( weapon )
{
tokens = strtok( weapon, "_" );
weaponClass = tablelookup( "mp/statstable.csv", 4, tokens[ 0 ], 2 );
if ( ismg( weapon ) )
{
weaponClass = "weapon_mg";
}
return weaponClass;
}
isWeaponDroppable( weap )
{
return ( maps\mp\gametypes\_weapons::maydropweapon( weap ) );
}
random( arr )
{
size = arr.size;
if ( !size )
{
return undefined;
}
return arr[ randomint( size ) ];
}
array_remove( ents, remover )
{
newents = [];
for ( i = 0; i < ents.size; i++ )
{
index = ents[ i ];
if ( index != remover )
{
newents[ newents.size ] = index;
}
}
return newents;
}
waittill_notify_or_timeout( not, tim )
{
self endon( not );
wait tim;
}
GetHostPlayer()
{
for ( i = 0; i < level.players.size; i++ )
{
player = level.players[ i ];
if ( !player is_host() )
{
continue;
}
return player;
}
return undefined;
}
bot_wait_for_host()
{
host = undefined;
while ( !isdefined( level ) || !isdefined( level.players ) )
{
wait 0.05;
}
for ( i = getdvarfloat( "bots_main_waitForHostTime" ); i > 0; i -= 0.05 )
{
host = GetHostPlayer();
if ( isdefined( host ) )
{
break;
}
wait 0.05;
}
if ( !isdefined( host ) )
{
return;
}
for ( i = getdvarfloat( "bots_main_waitForHostTime" ); i > 0; i -= 0.05 )
{
if ( isdefined( host.pers[ "team" ] ) )
{
break;
}
wait 0.05;
}
if ( !isdefined( host.pers[ "team" ] ) )
{
return;
}
for ( i = getdvarfloat( "bots_main_waitForHostTime" ); i > 0; i -= 0.05 )
{
if ( host.pers[ "team" ] == "allies" || host.pers[ "team" ] == "axis" )
{
break;
}
wait 0.05;
}
}
RaySphereIntersect( start, end, spherePos, radius )
{
r2 = radius * radius;
if ( distancesquared( start, spherePos ) < r2 )
{
return true;
}
if ( distancesquared( end, spherePos ) < r2 )
{
return true;
}
dp = end - start;
a = dp[ 0 ] * dp[ 0 ] + dp[ 1 ] * dp[ 1 ] + dp[ 2 ] * dp[ 2 ];
b = 2 * ( dp[ 0 ] * ( start[ 0 ] - spherePos[ 0 ] ) + dp[ 1 ] * ( start[ 1 ] - spherePos[ 1 ] ) + dp[ 2 ] * ( start[ 2 ] - spherePos[ 2 ] ) );
c = spherePos[ 0 ] * spherePos[ 0 ] + spherePos[ 1 ] * spherePos[ 1 ] + spherePos[ 2 ] * spherePos[ 2 ];
c += start[ 0 ] * start[ 0 ] + start[ 1 ] * start[ 1 ] + start[ 2 ] * start[ 2 ];
c -= 2.0 * ( spherePos[ 0 ] * start[ 0 ] + spherePos[ 1 ] * start[ 1 ] + spherePos[ 2 ] * start[ 2 ] );
c -= radius * radius;
bb4ac = b * b - 4.0 * a * c;
if ( abs( a ) < 0.0001 || bb4ac < 0 )
{
return false;
}
mu1 = ( 0 - b + sqrt( bb4ac ) ) / ( 2 * a );
ip1 = start + mu1 * dp;
myDist = distancesquared( start, end );
if ( distancesquared( start, ip1 ) > myDist  )
{
return false;
}
dpAngles = vectortoangles( dp );
if ( getConeDot( ip1, start, dpAngles ) < 0  )
{
return false;
}
return true;
}
SmokeTrace( start, end, rad )
{
for ( i = level.bots_smokelist.count - 1; i >= 0; i-- )
{
nade = level.bots_smokelist.data[ i ];
if ( nade.state != "smoking" )
{
continue;
}
if ( !RaySphereIntersect( start, end, nade.origin, rad ) )
{
continue;
}
return false;
}
return true;
}
getConeDot( to, from, dir )
{
dirToTarget = vectornormalize( to - from );
forward = anglestoforward( dir );
return vectordot( dirToTarget, forward );
}
distancesquared2D( to, from )
{
to = ( to[ 0 ], to[ 1 ], 0 );
from = ( from[ 0 ], from[ 1 ], 0 );
return distancesquared( to, from );
}
float_old( num )
{
setdvar( "temp_dvar_bot_util", num );
return getdvarfloat( "temp_dvar_bot_util" );
}
Round( x )
{
y = int( x );
if ( abs( x ) - abs( y ) > 0.5 )
{
if ( x < 0 )
{
return y - 1;
}
else
{
return y + 1;
}
}
else
{
return y;
}
}
angleclamp180( angle )
{
angleFrac = angle / 360.0;
angle = ( angleFrac - floor( angleFrac ) ) * 360.0;
if ( angle > 180.0 )
{
return angle - 360.0;
}
return angle;
}
clamp( a, minv, maxv )
{
return max( min( a, maxv ), minv );
}
keyCodeToString( a )
{
b = "";
switch ( a )
{
case 0:
b = "a";
break;
case 1:
b = "b";
break;
case 2:
b = "c";
break;
case 3:
b = "d";
break;
case 4:
b = "e";
break;
case 5:
b = "f";
break;
case 6:
b = "g";
break;
case 7:
b = "h";
break;
case 8:
b = "i";
break;
case 9:
b = "j";
break;
case 10:
b = "k";
break;
case 11:
b = "l";
break;
case 12:
b = "m";
break;
case 13:
b = "n";
break;
case 14:
b = "o";
break;
case 15:
b = "p";
break;
case 16:
b = "q";
break;
case 17:
b = "r";
break;
case 18:
b = "s";
break;
case 19:
b = "t";
break;
case 20:
b = "u";
break;
case 21:
b = "v";
break;
case 22:
b = "w";
break;
case 23:
b = "x";
break;
case 24:
b = "y";
break;
case 25:
b = "z";
break;
case 26:
b = ".";
break;
case 27:
b = " ";
break;
}
return b;
}
cac_init_patch()
{
if ( !isdefined( level.tbl_weaponids ) )
{
level.tbl_weaponids = [];
for ( i = 0; i < 150; i++ )
{
reference_s = tablelookup( "mp/statsTable.csv", 0, i, 4 );
if ( reference_s != "" )
{
level.tbl_weaponids[ i ][ "reference" ] = reference_s;
level.tbl_weaponids[ i ][ "group" ] = tablelookup( "mp/statstable.csv", 0, i, 2 );
level.tbl_weaponids[ i ][ "count" ] = int( tablelookup( "mp/statstable.csv", 0, i, 5 ) );
level.tbl_weaponids[ i ][ "attachment" ] = tablelookup( "mp/statstable.csv", 0, i, 8 );
}
else
{
continue;
}
}
}
if ( !isdefined( level.tbl_weaponattachment ) )
{
level.tbl_weaponattachment = [];
for ( i = 0; i < 8; i++ )
{
level.tbl_weaponattachment[ i ][ "bitmask" ] = int( tablelookup( "mp/attachmentTable.csv", 9, i, 10 ) );
level.tbl_weaponattachment[ i ][ "reference" ] = tablelookup( "mp/attachmentTable.csv", 9, i, 4 );
}
}
if ( !isdefined( level.tbl_perkdata ) )
{
level.tbl_perkdata = [];
for ( i = 150; i < 194; i++ )
{
reference_s = tablelookup( "mp/statsTable.csv", 0, i, 4 );
if ( reference_s != "" )
{
level.tbl_perkdata[ i ][ "reference" ] = reference_s;
level.tbl_perkdata[ i ][ "reference_full" ] = tablelookup( "mp/statsTable.csv", 0, i, 6 );
level.tbl_perkdata[ i ][ "count" ] = int( tablelookup( "mp/statsTable.csv", 0, i, 5 ) );
level.tbl_perkdata[ i ][ "group" ] = tablelookup( "mp/statsTable.csv", 0, i, 2 );
level.tbl_perkdata[ i ][ "name" ] = tablelookupistring( "mp/statsTable.csv", 0, i, 3 );
level.tbl_perkdata[ i ][ "perk_num" ] = tablelookup( "mp/statsTable.csv", 0, i, 8 );
}
else
{
continue;
}
}
}
level.perkreferencetoindex = [];
level.weaponreferencetoindex = [];
level.weaponattachmentreferencetoindex = [];
for ( i = 0; i < 150; i++ )
{
if ( !isdefined( level.tbl_weaponids[ i ] ) || !isdefined( level.tbl_weaponids[ i ][ "reference" ] ) )
{
continue;
}
level.weaponreferencetoindex[ level.tbl_weaponids[ i ][ "reference" ] ] = i;
}
for ( i = 0; i < 8; i++ )
{
if ( !isdefined( level.tbl_weaponattachment[ i ] ) || !isdefined( level.tbl_weaponattachment[ i ][ "reference" ] ) )
{
continue;
}
level.weaponattachmentreferencetoindex[ level.tbl_weaponattachment[ i ][ "reference" ] ] = i;
}
for ( i = 150; i < 194; i++ )
{
if ( !isdefined( level.tbl_perkdata[ i ] ) || !isdefined( level.tbl_perkdata[ i ][ "reference_full" ] ) )
{
continue;
}
level.perkreferencetoindex[ level.tbl_perkdata[ i ][ "reference_full" ] ] = i;
}
}
FrontLinesWaypoints()
{
waypoints = [];
for ( i = 0;; i++ )
{
dvar_answer = getdvar( "flwp_" + i );
if ( dvar_answer == "" || dvar_answer == "eof" )
{
break;
}
toks = strtok( dvar_answer, "," );
waypoint = spawnstruct();
wp_num = int( toks[ 0 ] );
x = float_old( toks[ 1 ] );
y = float_old( toks[ 2 ] );
z = float_old( toks[ 3 ] );
waypoint.origin = ( x, y, z );
waypoint.type = toks[ 4 ];
waypoint.children = [];
num_children = int( toks[ 5 ] );
for ( h = 0; h < num_children; h++ )
{
waypoint.children[ waypoint.children.size ] = int( toks[ 6 + h ] );
}
waypoints[ wp_num ] = waypoint;
}
return waypoints;
}
parseTokensIntoWaypoint( tokens )
{
waypoint = spawnstruct();
orgStr = tokens[ 0 ];
orgToks = strtok( orgStr, " " );
waypoint.origin = ( float_old( orgToks[ 0 ] ), float_old( orgToks[ 1 ] ), float_old( orgToks[ 2 ] ) );
childStr = tokens[ 1 ];
childToks = strtok( childStr, " " );
waypoint.children = [];
for ( j = 0; j < childToks.size; j++ )
{
waypoint.children[ j ] = int( childToks[ j ] );
}
type = tokens[ 2 ];
waypoint.type = type;
anglesStr = tokens[ 3 ];
if ( isdefined( anglesStr ) && anglesStr != "" )
{
anglesToks = strtok( anglesStr, " " );
if ( anglesToks.size >= 3 )
{
waypoint.angles = ( float_old( anglesToks[ 0 ] ), float_old( anglesToks[ 1 ] ), float_old( anglesToks[ 2 ] ) );
}
}
return waypoint;
}
getABotName()
{
if ( !isdefined( level.bot_names ) )
{
level.bot_names = [];
if ( getdvar( "temp_dvar_bot_name_cursor" ) == "" )
{
setdvar( "temp_dvar_bot_name_cursor", 0 );
}
filename = "botnames.txt";
if ( BotBuiltinFileExists( filename ) )
{
f = BotBuiltinFileOpen( filename, "read" );
if ( f > 0 )
{
for ( line = BotBuiltinReadLine( f ); isdefined( line ); line = BotBuiltinReadLine( f ) )
{
level.bot_names[ level.bot_names.size ] = line;
}
BotBuiltinFileClose( f );
}
}
}
if ( !level.bot_names.size )
{
return undefined;
}
cur = getdvarint( "temp_dvar_bot_name_cursor" );
name = level.bot_names[ cur % level.bot_names.size ];
setdvar( "temp_dvar_bot_name_cursor", cur + 1 );
return name;
}
readWpsFromFile( mapname )
{
waypoints = [];
filename = "waypoints/" + mapname + "_wp.csv";
if ( !BotBuiltinFileExists( filename ) )
{
return waypoints;
}
f = BotBuiltinFileOpen( filename, "read" );
if ( f < 1 )
{
return waypoints;
}
BotBuiltinPrintConsole( "Attempting to read waypoints from " + filename );
line = BotBuiltinReadLine( f );
if ( isdefined( line ) )
{
waypointCount = int( line );
for ( i = 1; i <= waypointCount; i++ )
{
line = BotBuiltinReadLine( f );
if ( !isdefined( line ) )
{
break;
}
tokens = strtok( line, "," );
waypoint = parseTokensIntoWaypoint( tokens );
waypoints[ i - 1 ] = waypoint;
}
}
BotBuiltinFileClose( f );
return waypoints;
}
load_waypoints()
{
mapname = getdvar( "mapname" );
level.waypointcount = 0;
level.waypointusage = [];
level.waypointusage[ "allies" ] = [];
level.waypointusage[ "axis" ] = [];
if ( !isdefined( level.waypoints ) )
{
level.waypoints = [];
}
wps = readWpsFromFile( mapname );
if ( wps.size )
{
level.waypoints = wps;
BotBuiltinPrintConsole( "Loaded " + wps.size + " waypoints from file." );
}
else
{
switch ( mapname )
{
default:
maps\mp\bots\waypoints\_custom_map::main( mapname );
break;
}
if ( level.waypoints.size )
{
BotBuiltinPrintConsole( "Loaded " + level.waypoints.size + " waypoints from script." );
}
}
if ( !level.waypoints.size )
{
level.waypoints = FrontLinesWaypoints();
if ( level.waypoints.size )
{
BotBuiltinPrintConsole( "Loaded " + level.waypoints.size + " waypoints from frontlines." );
}
}
if ( !level.waypoints.size )
{
BotBuiltinPrintConsole( "No waypoints loaded!" );
}
level.waypointcount = level.waypoints.size;
for ( i = 0; i < level.waypointcount; i++ )
{
if ( !isdefined( level.waypoints[ i ].children ) || !isdefined( level.waypoints[ i ].children.size ) )
{
level.waypoints[ i ].children = [];
}
if ( !isdefined( level.waypoints[ i ].origin ) )
{
level.waypoints[ i ].origin = ( 0, 0, 0 );
}
if ( !isdefined( level.waypoints[ i ].type ) )
{
level.waypoints[ i ].type = "crouch";
}
level.waypoints[ i ].childcount = undefined;
}
}
nearAnyOfWaypoints( dist, waypoints )
{
dist *= dist;
for ( i = 0; i < waypoints.size; i++ )
{
waypoint = level.waypoints[ waypoints[ i ] ];
if ( distancesquared( waypoint.origin, self.origin ) > dist )
{
continue;
}
return true;
}
return false;
}
waypointsNear( waypoints, dist )
{
dist *= dist;
answer = [];
for ( i = 0; i < waypoints.size; i++ )
{
wp = level.waypoints[ waypoints[ i ] ];
if ( distancesquared( wp.origin, self.origin ) > dist )
{
continue;
}
answer[ answer.size ] = waypoints[ i ];
}
return answer;
}
getNearestWaypointOfWaypoints( waypoints )
{
answer = undefined;
closestDist = 2147483647;
for ( i = 0; i < waypoints.size; i++ )
{
waypoint = level.waypoints[ waypoints[ i ] ];
thisDist = distancesquared( self.origin, waypoint.origin );
if ( isdefined( answer ) && thisDist > closestDist )
{
continue;
}
answer = waypoints[ i ];
closestDist = thisDist;
}
return answer;
}
getWaypointsOfType( type )
{
answer = [];
for ( i = 0; i < level.waypointcount; i++ )
{
wp = level.waypoints[ i ];
if ( type == "camp" )
{
if ( wp.type != "crouch" )
{
continue;
}
if ( wp.children.size != 1 )
{
continue;
}
}
else if ( type != wp.type )
{
continue;
}
answer[ answer.size ] = i;
}
return answer;
}
getWaypointForIndex( i )
{
if ( !isdefined( i ) )
{
return undefined;
}
return level.waypoints[ i ];
}
getGoodMapAmount()
{
switch ( getdvar( "mapname" ) )
{
case "mp_crash":
case "mp_crash_snow":
case "mp_countdown":
case "mp_carentan":
case "mp_creek":
case "mp_broadcast":
case "mp_cargoship":
case "mp_pipeline":
case "mp_overgrown":
case "mp_strike":
case "mp_farm":
case "mp_crossfire":
case "mp_backlot":
case "mp_convoy":
case "mp_bloc":
if ( level.teambased )
{
return 14;
}
else
{
return 9;
}
case "mp_vacant":
case "mp_showdown":
case "mp_citystreets":
case "mp_bog":
if ( level.teambased )
{
return 12;
}
else
{
return 8;
}
case "mp_killhouse":
case "mp_shipment":
if ( level.teambased )
{
return 8;
}
else
{
return 4;
}
}
return 2;
}
getMapName( map )
{
switch ( map )
{
case "mp_convoy":
return "Ambush";
case "mp_backlot":
return "Backlot";
case "mp_bloc":
return "Bloc";
case "mp_bog":
return "Bog";
case "mp_countdown":
return "Countdown";
case "mp_crash":
return "Crash";
case "mp_crash_snow":
return "Winter Crash";
case "mp_crossfire":
return "Crossfire";
case "mp_citystreets":
return "District";
case "mp_farm":
return "Downpour";
case "mp_overgrown":
return "Overgrown";
case "mp_pipeline":
return "Pipeline";
case "mp_shipment":
return "Shipment";
case "mp_showdown":
return "Showdown";
case "mp_strike":
return "Strike";
case "mp_vacant":
return "Vacant";
case "mp_cargoship":
return "Wetwork";
case "mp_broadcast":
return "Broadcast";
case "mp_creek":
return "Creek";
case "mp_carentan":
return "Chinatown";
case "mp_killhouse":
return "Killhouse";
}
return map;
}
doExtraCheck()
{
maps\mp\bots\_bot_internal::checkTheBots();
}
getBotToKick()
{
bots = getBotArray();
if ( !isdefined( bots ) || !isdefined( bots.size ) || bots.size <= 0 || !isdefined( bots[ 0 ] ) )
{
return undefined;
}
tokick = undefined;
axis = 0;
allies = 0;
team = getdvar( "bots_team" );
for ( i = 0; i < bots.size; i++ )
{
bot = bots[ i ];
if ( !isdefined( bot ) || !isdefined( bot.team ) )
{
continue;
}
if ( bot.team == "allies" )
{
allies++;
}
else if ( bot.team == "axis" )
{
axis++;
}
else
{
return bot;
}
}
if ( team == "custom" || team == "axis" )
{
team = "allies";
}
else if ( team == "autoassign" )
{
team = "allies";
if ( axis > allies )
{
team = "axis";
}
}
else
{
team = "axis";
}
for ( i = 0; i < bots.size; i++ )
{
bot = bots[ i ];
if ( !isdefined( bot ) || !isdefined( bot.team ) )
{
continue;
}
if ( bot.team != team )
{
continue;
}
if ( !isdefined( bot.pers ) || !isdefined( bot.pers[ "bots" ] ) || !isdefined( bot.pers[ "bots" ][ "skill" ] ) || !isdefined( bot.pers[ "bots" ][ "skill" ][ "base" ] ) )
{
continue;
}
if ( isdefined( tokick ) && bot.pers[ "bots" ][ "skill" ][ "base" ] > tokick.pers[ "bots" ][ "skill" ][ "base" ] )
{
continue;
}
tokick = bot;
}
if ( isdefined( tokick ) )
{
return tokick;
}
for ( i = 0; i < bots.size; i++ )
{
bot = bots[ i ];
if ( !isdefined( bot ) || !isdefined( bot.team ) )
{
continue;
}
if ( !isdefined( bot.pers ) || !isdefined( bot.pers[ "bots" ] ) || !isdefined( bot.pers[ "bots" ][ "skill" ] ) || !isdefined( bot.pers[ "bots" ][ "skill" ][ "base" ] ) )
{
continue;
}
if ( isdefined( tokick ) && bot.pers[ "bots" ][ "skill" ][ "base" ] > tokick.pers[ "bots" ][ "skill" ][ "base" ] )
{
continue;
}
tokick = bot;
}
return tokick;
}
getBotArray()
{
result = [];
playercount = level.players.size;
for ( i = 0; i < playercount; i++ )
{
player = level.players[ i ];
if ( !player is_bot() )
{
continue;
}
result[ result.size ] = player;
}
return result;
}
WaypointsToKDTree()
{
kdTree = KDTree();
kdTree _WaypointsToKDTree( level.waypoints, 0 );
return kdTree;
}
_WaypointsToKDTree( waypoints, dem )
{
if ( !waypoints.size )
{
return;
}
callbacksort = undefined;
switch ( dem )
{
case 0:
callbacksort = ::HeapSortCoordX;
break;
case 1:
callbacksort = ::HeapSortCoordY;
break;
case 2:
callbacksort = ::HeapSortCoordZ;
break;
}
heap = NewHeap( callbacksort );
for ( i = 0; i < waypoints.size; i++ )
{
heap HeapInsert( waypoints[ i ] );
}
sorted = [];
while ( heap.data.size )
{
sorted[ sorted.size ] = heap.data[ 0 ];
heap HeapRemove();
}
median = int( sorted.size / 2 );
left = [];
right = [];
for ( i = 0; i < sorted.size; i++ )
{
if ( i < median )
{
right[ right.size ] = sorted[ i ];
}
else if ( i > median )
{
left[ left.size ] = sorted[ i ];
}
}
self KDTreeInsert( sorted[ median ] );
_WaypointsToKDTree( left, ( dem + 1 ) % 3 );
_WaypointsToKDTree( right, ( dem + 1 ) % 3 );
}
List()
{
list = spawnstruct();
list.count = 0;
list.data = [];
return list;
}
ListAdd( thing )
{
self.data[ self.count ] = thing;
self.count++;
}
ListAddFirst( thing )
{
for ( i = self.count - 1; i >= 0; i-- )
{
self.data[ i + 1 ] = self.data[ i ];
}
self.data[ 0 ] = thing;
self.count++;
}
ListRemove( thing )
{
for ( i = 0; i < self.count; i++ )
{
if ( self.data[ i ] == thing )
{
while ( i < self.count - 1 )
{
self.data[ i ] = self.data[ i + 1 ];
i++;
}
self.data[ i ] = undefined;
self.count--;
break;
}
}
}
KDTree()
{
kdTree = spawnstruct();
kdTree.root = undefined;
kdTree.count = 0;
return kdTree;
}
KDTreeInsert( data )
{
self.root = self _KDTreeInsert( self.root, data, 0, -2147483647, -2147483647, -2147483647, 2147483647, 2147483647, 2147483647 );
}
_KDTreeInsert( node, data, dem, x0, y0, z0, x1, y1, z1 )
{
if ( !isdefined( node ) )
{
r = spawnstruct();
r.data = data;
r.left = undefined;
r.right = undefined;
r.x0 = x0;
r.x1 = x1;
r.y0 = y0;
r.y1 = y1;
r.z0 = z0;
r.z1 = z1;
self.count++;
return r;
}
switch ( dem )
{
case 0:
if ( data.origin[ 0 ] < node.data.origin[ 0 ] )
{
node.left = self _KDTreeInsert( node.left, data, 1, x0, y0, z0, node.data.origin[ 0 ], y1, z1 );
}
else
{
node.right = self _KDTreeInsert( node.right, data, 1, node.data.origin[ 0 ], y0, z0, x1, y1, z1 );
}
break;
case 1:
if ( data.origin[ 1 ] < node.data.origin[ 1 ] )
{
node.left = self _KDTreeInsert( node.left, data, 2, x0, y0, z0, x1, node.data.origin[ 1 ], z1 );
}
else
{
node.right = self _KDTreeInsert( node.right, data, 2, x0, node.data.origin[ 1 ], z0, x1, y1, z1 );
}
break;
case 2:
if ( data.origin[ 2 ] < node.data.origin[ 2 ] )
{
node.left = self _KDTreeInsert( node.left, data, 0, x0, y0, z0, x1, y1, node.data.origin[ 2 ] );
}
else
{
node.right = self _KDTreeInsert( node.right, data, 0, x0, y0, node.data.origin[ 2 ], x1, y1, z1 );
}
break;
}
return node;
}
KDTreeNearest( origin )
{
if ( !isdefined( self.root ) )
{
return undefined;
}
return self _KDTreeNearest( self.root, origin, self.root.data, distancesquared( self.root.data.origin, origin ), 0 );
}
_KDTreeNearest( node, point, closest, closestdist, dem )
{
if ( !isdefined( node ) )
{
return closest;
}
thisDis = distancesquared( node.data.origin, point );
if ( thisDis < closestdist )
{
closestdist = thisDis;
closest = node.data;
}
if ( node Rectdistancesquared( point ) < closestdist )
{
near = node.left;
far = node.right;
if ( point[ dem ] > node.data.origin[ dem ] )
{
near = node.right;
far = node.left;
}
closest = self _KDTreeNearest( near, point, closest, closestdist, ( dem + 1 ) % 3 );
closest = self _KDTreeNearest( far, point, closest, distancesquared( closest.origin, point ), ( dem + 1 ) % 3 );
}
return closest;
}
Rectdistancesquared( origin )
{
dx = 0;
dy = 0;
dz = 0;
if ( origin[ 0 ] < self.x0 )
{
dx = origin[ 0 ] - self.x0;
}
else if ( origin[ 0 ] > self.x1 )
{
dx = origin[ 0 ] - self.x1;
}
if ( origin[ 1 ] < self.y0 )
{
dy = origin[ 1 ] - self.y0;
}
else if ( origin[ 1 ] > self.y1 )
{
dy = origin[ 1 ] - self.y1;
}
if ( origin[ 2 ] < self.z0 )
{
dz = origin[ 2 ] - self.z0;
}
else if ( origin[ 2 ] > self.z1 )
{
dz = origin[ 2 ] - self.z1;
}
return dx * dx + dy * dy + dz * dz;
}
HeapSortCoordX( item, item2 )
{
return item.origin[ 0 ] > item2.origin[ 0 ];
}
HeapSortCoordY( item, item2 )
{
return item.origin[ 1 ] > item2.origin[ 1 ];
}
HeapSortCoordZ( item, item2 )
{
return item.origin[ 2 ] > item2.origin[ 2 ];
}
Heap( item, item2 )
{
return item > item2;
}
ReverseHeap( item, item2 )
{
return item < item2;
}
HeapTraceFraction( item, item2 )
{
return item[ "fraction" ] > item2[ "fraction" ];
}
NewHeap( compare )
{
heap_node = spawnstruct();
heap_node.data = [];
heap_node.compare = compare;
return heap_node;
}
HeapInsert( item )
{
insert = self.data.size;
self.data[ insert ] = item;
current = insert + 1;
while ( current > 1 )
{
last = current;
current = int( current / 2 );
if ( ![[ self.compare ]]( item, self.data[ current - 1 ] ) )
{
break;
}
self.data[ last - 1 ] = self.data[ current - 1 ];
self.data[ current - 1 ] = item;
}
}
_HeapNextChild( node, hsize )
{
left = node * 2;
right = left + 1;
if ( left > hsize )
{
return -1;
}
if ( right > hsize )
{
return left;
}
if ( [[ self.compare ]]( self.data[ left - 1 ], self.data[ right - 1 ] ) )
{
return left;
}
else
{
return right;
}
}
HeapRemove()
{
remove = self.data.size;
if ( !remove )
{
return remove;
}
move = self.data[ remove - 1 ];
self.data[ 0 ] = move;
self.data[ remove - 1 ] = undefined;
remove--;
if ( !remove )
{
return remove;
}
last = 1;
next = self _HeapNextChild( 1, remove );
while ( next != -1 )
{
if ( [[ self.compare ]]( move, self.data[ next - 1 ] ) )
{
break;
}
self.data[ last - 1 ] = self.data[ next - 1 ];
self.data[ next - 1 ] = move;
last = next;
next = self _HeapNextChild( next, remove );
}
return remove;
}
ReverseHeapAStar( item, item2 )
{
return item.f < item2.f;
}
RemoveWaypointUsage( wp, team )
{
if ( !isdefined( level.waypointusage ) )
{
return;
}
if ( !isdefined( level.waypointusage[ team ][ wp + "" ] ) )
{
return;
}
level.waypointusage[ team ][ wp + "" ]--;
if ( level.waypointusage[ team ][ wp + "" ] <= 0 )
{
level.waypointusage[ team ][ wp + "" ] = undefined;
}
}
GetNearestWaypointWithSight( pos )
{
candidate = undefined;
dist = 2147483647;
for ( i = 0; i < level.waypointcount; i++ )
{
if ( !bullettracepassed( pos + ( 0, 0, 15 ), level.waypoints[ i ].origin + ( 0, 0, 15 ), false, undefined ) )
{
continue;
}
curdis = distancesquared( level.waypoints[ i ].origin, pos );
if ( curdis > dist )
{
continue;
}
dist = curdis;
candidate = i;
}
return candidate;
}
getNearestWaypoint( pos )
{
candidate = undefined;
dist = 2147483647;
for ( i = 0; i < level.waypointcount; i++ )
{
curdis = distancesquared( level.waypoints[ i ].origin, pos );
if ( curdis > dist )
{
continue;
}
dist = curdis;
candidate = i;
}
return candidate;
}
AStarSearch( start, goal, team, greedy_path )
{
open = NewHeap( ::ReverseHeapAStar );
openset = [];
closed = [];
startWp = getNearestWaypoint( start );
if ( !isdefined( startWp ) )
{
return [];
}
_startwp = undefined;
if ( !bullettracepassed( start + ( 0, 0, 15 ), level.waypoints[ startWp ].origin + ( 0, 0, 15 ), false, undefined ) )
{
_startwp = GetNearestWaypointWithSight( start );
}
if ( isdefined( _startwp ) )
{
startWp = _startwp;
}
goalWp = getNearestWaypoint( goal );
if ( !isdefined( goalWp ) )
{
return [];
}
_goalwp = undefined;
if ( !bullettracepassed( goal + ( 0, 0, 15 ), level.waypoints[ goalWp ].origin + ( 0, 0, 15 ), false, undefined ) )
{
_goalwp = GetNearestWaypointWithSight( goal );
}
if ( isdefined( _goalwp ) )
{
goalWp = _goalwp;
}
node = spawnstruct();
node.g = 0;
node.h = distancesquared( level.waypoints[ startWp ].origin, level.waypoints[ goalWp ].origin );
node.f = node.h + node.g;
node.index = startWp;
node.parent = undefined;
openset[ node.index + "" ] = node;
open HeapInsert( node );
while ( open.data.size )
{
bestNode = open.data[ 0 ];
open HeapRemove();
openset[ bestNode.index + "" ] = undefined;
wp = level.waypoints[ bestNode.index ];
if ( bestNode.index == goalWp )
{
path = [];
while ( isdefined( bestNode ) )
{
if ( isdefined( team ) && isdefined( level.waypointusage ) )
{
if ( !isdefined( level.waypointusage[ team ][ bestNode.index + "" ] ) )
{
level.waypointusage[ team ][ bestNode.index + "" ] = 0;
}
level.waypointusage[ team ][ bestNode.index + "" ]++;
}
path[ path.size ] = bestNode.index;
bestNode = bestNode.parent;
}
return path;
}
for ( i = wp.children.size - 1; i >= 0; i-- )
{
child = wp.children[ i ];
childWp = level.waypoints[ child ];
penalty = 1;
if ( !greedy_path && isdefined( team ) && isdefined( level.waypointusage ) )
{
temppen = 1;
if ( isdefined( level.waypointusage[ team ][ child + "" ] ) )
{
temppen = level.waypointusage[ team ][ child + "" ];
}
if ( temppen > 1 )
{
penalty = temppen;
}
}
if ( childWp.type == "climb" || childWp.type == "prone" )
{
penalty += 4;
}
newg = bestNode.g + distancesquared( wp.origin, childWp.origin ) * penalty;
inopen = isdefined( openset[ child + "" ] );
if ( inopen && openset[ child + "" ].g <= newg )
{
continue;
}
inclosed = isdefined( closed[ child + "" ] );
if ( inclosed && closed[ child + "" ].g <= newg )
{
continue;
}
node = undefined;
if ( inopen )
{
node = openset[ child + "" ];
}
else if ( inclosed )
{
node = closed[ child + "" ];
}
else
{
node = spawnstruct();
}
node.parent = bestNode;
node.g = newg;
node.h = distancesquared( childWp.origin, level.waypoints[ goalWp ].origin );
node.f = node.g + node.h;
node.index = child;
if ( inclosed )
{
closed[ child + "" ] = undefined;
}
if ( !inopen )
{
open HeapInsert( node );
openset[ child + "" ] = node;
}
}
closed[ bestNode.index + "" ] = bestNode;
}
return [];
}
Log( x )
{
old_sum = 0.0;
xmlxpl = ( x - 1 ) / ( x + 1 );
xmlxpl_2 = xmlxpl * xmlxpl;
denom = 1.0;
frac = xmlxpl;
sum = frac;
while ( sum != old_sum )
{
old_sum = sum;
denom += 2.0;
frac *= xmlxpl_2;
sum += frac / denom;
}
answer = 2.0 * sum;
return answer;
}
array_combine( array1, array2 )
{
if ( !array1.size )
{
return array2;
}
array3 = [];
keys = getarraykeys( array1 );
for ( i = 0; i < keys.size; i++ )
{
key = keys[ i ];
array3[ array3.size ] = array1[ key ];
}
keys = getarraykeys( array2 );
for ( i = 0; i < keys.size; i++ )
{
key = keys[ i ];
array3[ array3.size ] = array2[ key ];
}
return array3;
}
array_average( array )
{
assert( array.size > 0 );
total = 0;
for ( i = 0; i < array.size; i++ )
{
total += array[ i ];
}
return ( total / array.size );
}
array_std_deviation( array, mean )
{
assert( array.size > 0 );
tmp = [];
for ( i = 0; i < array.size; i++ )
{
tmp[ i ] = ( array[ i ] - mean ) * ( array[ i ] - mean );
}
total = 0;
for ( i = 0; i < tmp.size; i++ )
{
total = total + tmp[ i ];
}
return sqrt( total / array.size );
}
random_normal_distribution( mean, std_deviation, lower_bound, upper_bound )
{
x1 = 0;
x2 = 0;
w = 1;
y1 = 0;
while ( w >= 1 )
{
x1 = 2 * randomfloatrange( 0, 1 ) - 1;
x2 = 2 * randomfloatrange( 0, 1 ) - 1;
w = x1 * x1 + x2 * x2;
}
w = sqrt( ( -2.0 * Log( w ) ) / w );
y1 = x1 * w;
number = mean + y1 * std_deviation;
if ( isdefined( lower_bound ) && number < lower_bound )
{
number = lower_bound;
}
if ( isdefined( upper_bound ) && number > upper_bound )
{
number = upper_bound;
}
return ( number );
}
onUsePlantObjectFix( player )
{
if ( !self maps\mp\gametypes\_gameobjects::isfriendlyteam( player.pers[ "team" ] ) )
{
level thread bombPlantedFix( self, player );
player logstring( "bomb planted: " + self.label );
for ( index = 0; index < level.bombzones.size; index++ )
{
if ( level.bombzones[ index ] == self )
{
continue;
}
level.bombzones[ index ] maps\mp\gametypes\_gameobjects::disableobject();
}
player playsound( "mp_bomb_plant" );
player notify ( "bomb_planted" );
if ( !level.hardcoremode )
{
iprintln( &"MP_EXPLOSIVES_PLANTED_BY", player );
}
maps\mp\gametypes\_globallogic::leaderdialog( "bomb_planted" );
maps\mp\gametypes\_globallogic::giveplayerscore( "plant", player );
player thread [[ level.onxpevent ]]( "plant" );
}
}
bombPlantedFix( destroyedObj, player )
{
maps\mp\gametypes\_globallogic::pausetimer();
level.bombplanted = true;
destroyedObj.visuals[ 0 ] thread maps\mp\gametypes\_globallogic::playtickingsound();
level.tickingobject = destroyedObj.visuals[ 0 ];
level.timelimitoverride = true;
setgameendtime( int( gettime() + ( level.bombtimer * 1000 ) ) );
setdvar( "ui_bomb_timer", 1 );
if ( !level.multibomb )
{
level.sdbomb maps\mp\gametypes\_gameobjects::allowcarry( "none" );
level.sdbomb maps\mp\gametypes\_gameobjects::setvisibleteam( "none" );
level.sdbomb maps\mp\gametypes\_gameobjects::setdropped();
level.sdbombmodel = level.sdbomb.visuals[ 0 ];
}
else
{
for ( index = 0; index < level.players.size; index++ )
{
if ( isdefined( level.players[ index ].carryicon ) )
{
level.players[ index ].carryicon destroyelem();
}
}
trace = bullettrace( player.origin + ( 0, 0, 20 ), player.origin - ( 0, 0, 2000 ), false, player );
tempAngle = randomfloat( 360 );
forward = ( cos( tempAngle ), sin( tempAngle ), 0 );
forward = vectornormalize( forward - vector_scale( trace[ "normal" ], vectordot( forward, trace[ "normal" ] ) ) );
dropAngles = vectortoangles( forward );
level.sdbombmodel = spawn( "script_model", trace[ "position" ] );
level.sdbombmodel.angles = dropAngles;
level.sdbombmodel setmodel( "prop_suitcase_bomb" );
}
destroyedObj maps\mp\gametypes\_gameobjects::allowuse( "none" );
destroyedObj maps\mp\gametypes\_gameobjects::setvisibleteam( "none" );
label = destroyedObj maps\mp\gametypes\_gameobjects::getlabel();
trigger = destroyedObj.bombdefusetrig;
trigger.origin = level.sdbombmodel.origin;
visuals = [];
defuseObject = maps\mp\gametypes\_gameobjects::createuseobject( game[ "defenders" ], trigger, visuals, ( 0, 0, 32 ) );
defuseObject maps\mp\gametypes\_gameobjects::allowuse( "friendly" );
defuseObject maps\mp\gametypes\_gameobjects::setusetime( level.defusetime );
defuseObject maps\mp\gametypes\_gameobjects::setusetext( &"MP_DEFUSING_EXPLOSIVE" );
defuseObject maps\mp\gametypes\_gameobjects::setusehinttext( &"PLATFORM_HOLD_TO_DEFUSE_EXPLOSIVES" );
defuseObject maps\mp\gametypes\_gameobjects::setvisibleteam( "any" );
defuseObject maps\mp\gametypes\_gameobjects::set2dicon( "friendly", "compass_waypoint_defuse" + label );
defuseObject maps\mp\gametypes\_gameobjects::set2dicon( "enemy", "compass_waypoint_defend" + label );
defuseObject maps\mp\gametypes\_gameobjects::set3dicon( "friendly", "waypoint_defuse" + label );
defuseObject maps\mp\gametypes\_gameobjects::set3dicon( "enemy", "waypoint_defend" + label );
defuseObject.label = label;
defuseObject.onbeginuse = maps\mp\gametypes\sd::onbeginuse;
defuseObject.onenduse = maps\mp\gametypes\sd::onenduse;
defuseObject.onuse = maps\mp\gametypes\sd::onusedefuseobject;
defuseObject.useweapon = "briefcase_bomb_defuse_mp";
level.defuseobject = defuseObject;
maps\mp\gametypes\sd::bombtimerwait();
setdvar( "ui_bomb_timer", 0 );
destroyedObj.visuals[ 0 ] maps\mp\gametypes\_globallogic::stoptickingsound();
if ( level.gameended || level.bombdefused )
{
return;
}
level.bombexploded = true;
explosionOrigin = level.sdbombmodel.origin;
level.sdbombmodel hide();
if ( isdefined( player ) )
{
destroyedObj.visuals[ 0 ] radiusdamage( explosionOrigin, 512, 200, 20, player );
}
else
{
destroyedObj.visuals[ 0 ] radiusdamage( explosionOrigin, 512, 200, 20 );
}
rot = randomfloat( 360 );
explosionEffect = spawnfx( level._effect[ "bombexplosion" ], explosionOrigin + ( 0, 0, 50 ), ( 0, 0, 1 ), ( cos( rot ), sin( rot ), 0 ) );
triggerfx( explosionEffect );
thread maps\mp\gametypes\sd::playsoundinspace( "exp_suitcase_bomb_main", explosionOrigin );
if ( isdefined( destroyedObj.exploderindex ) )
{
exploder( destroyedObj.exploderindex );
}
for ( index = 0; index < level.bombzones.size; index++ )
{
level.bombzones[ index ] maps\mp\gametypes\_gameobjects::disableobject();
}
defuseObject maps\mp\gametypes\_gameobjects::disableobject();
setgameendtime( 0 );
wait 3;
maps\mp\gametypes\sd::sd_endgame( game[ "attackers" ], game[ "strings" ][ "target_destroyed" ] );
}
