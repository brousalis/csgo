# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

User.create([
  {username: 'test',
   email: 'test@test.com',
   password: 'password', 
   password_confirmation: 'password'},
])

AdminUser.create({
  email: 'admin@example.com',
  password: 'password',
  password_confirmation: 'password',
})

u = User.find 1

Surf::Map.create([
  {name: 'surf_kitsune', url: 'http://steamworkshop.com/maps/surf_kitsune', tier: 1, map_type: 'stages', created_by_user: u},
  {name: 'surf_classics', url: 'http://steamworkshop.com/maps/surf_classics', tier: 1, map_type: 'stages', created_by_user: u},
  {name: 'surf_syria', url: 'http://steamworkshop.com/maps/surf_syria', tier: 2, map_type: 'linear', created_by_user: u},
  {name: 'surf_utopia_v3', url: 'http://steamworkshop.com/maps/surf_utopia_v3', tier: 2, map_type: 'linear', created_by_user: u},
  {name: 'surf_mesa', url: 'http://steamworkshop.com/maps/surf_mesa', tier: 1, map_type: 'linear', created_by_user: u},
])

ServerGroup.create([
  {name: 'KSF', url: 'ksfclan.com', description: 'KSF Friendly clan We like to surf. We have tons of servers available, hold tournaments. Check out our website at ksfclan.com', owner: 'brous', created_by_user: u},
  {name: 'Butts', url: 'butts.com', description: 'Butts Friendly clan We like to surf. We have tons of servers available, hold tournaments. Check out our website at ksfclan.com', owner: 'brous', created_by_user: u},
  {name: 'CGN', url: 'chicagogamingnetwork.com', description: '--CGN-- Friendly clan We like to surf. We have tons of servers available, hold tournaments. Check out our website at ksfclan.com', owner: 'brous', created_by_user: u},
])

sg = ServerGroup.find_by_name('KSF')

Surf::Server.create([
  {name: '[KSFClan.com] #1 24/7 SurfTimer!', url: 'ksfclan.com', ip: '70.42.74.194', port: '27015', created_by_user: u, server_group: sg}, 
  {name: '[KSFClan.com] #2 Expert Server [Tier1-3]', url: 'ksfclan.com', ip: '70.42.74.194', port: '27016', created_by_user: u, server_group: sg}, 
  {name: 'AG:// NewbSurf #2 [Tier 1-3] AlliedGamers.net', url: 'ksfclan.com', ip: '74.91.113.128', port: '27015', created_by_user: u}, 
  {name: 'OGN:// NewbSurf #1 [Tier 1-2] OpticalGamingNetwork', url: 'opticalgaming.com', ip: '192.223.31.212', port: '27015', created_by_user: u}, 
])

Surf::Video.create([
  {title: "Surf Kitsune World Record", youtube_url: "https://www.youtube.com/watch?v=c6m8OUyshkE", map: Surf::Map.find_by_name('surf_kitsune'), created_by_user: u}
])
