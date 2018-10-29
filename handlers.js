/*
 * Handlers for the application 
 * 
 * 
 */

// Define the handlers
handlers = {};

// Sample
handlers.ping = (data, callback) => callback(200);

handlers.notFound = (data, callback) => callback(404);

module.exports = handlers;
