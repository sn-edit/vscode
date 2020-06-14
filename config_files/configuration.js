/**
 * @param {{ db: string; password: string; user: string; root_directory: string; url: string; }} config
 */
const getYaml = (config) => {

  let config_yaml = { app: 
    { core: 
       { log_level: 'debug',
         rate_limit: 2,
         db: { path: config.db, initialised: false },
         rest: 
          { masked: false,
            password: config.password,
            url: config.url,
            user: config.user,
            xor_key: 'randomxorkey' },
         root_directory: config.root_directory },
      tables: 
       [ { name: 'sys_script',
           unique_key: 'sys_name',
           fields: 
            [ { extension: 'txt', field: 'sys_id' },
              { extension: 'js', field: 'script' },
              { extension: 'txt', field: 'sys_name' } ] },
         { name: 'sys_script_include',
           unique_key: 'sys_name',
           fields: 
            [ { extension: 'txt', field: 'sys_id' },
              { extension: 'js', field: 'script' },
              { extension: 'txt', field: 'sys_name' } ] } ] } }


  return config_yaml;

}

module.exports = {
  getYaml: getYaml
}