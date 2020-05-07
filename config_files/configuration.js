/**
 * @param {{ db: string; password: string; user: string; root_directory: string; url: string; }} config
 */
const getYaml = (config) => {

  let config_yaml = { app: 
    { log_level: 'debug',
      rate_limit: 2,
      db: { path: config.db, initialised: false },
      rest: 
       { masked: false,
         password: config.password,
         url: config.url,
         user: config.user,
         xor_key: 'randomxorkey' },
      root_directory: config.root_directory,
      tables: 
       [ { name: 'sys_script',
           fields: 
            [ { field: 'sys_id', extension: 'txt' },
              { field: 'script', extension: 'js' },
              { field: 'sys_name', extension: 'txt' } ] },
         { name: 'sys_script_include',
           fields: 
            [ { field: 'sys_id', extension: 'txt' },
              { field: 'script', extension: 'js' },
              { field: 'sys_name', extension: 'txt' } ] } ] } };

  return config_yaml;

}

module.exports = {
  getYaml: getYaml
}