const getYaml = (config) => {

  let config_yaml = {
    "db_path": config.db_path,
    "log_level": "info",
    "rate_limiting_clearing": 2,
    "rest_credentials": {
      "password": config.password,
      "user": config.user,
      "xor_key": "randomxorkey",
      "masked": false
    },
    "script_path": config.script_path,
    "servicenow_instance_url": config.servicenow_instance_url,
    "tables": [{
        "fields": [{
            "field": "sys_id"
          },
          {
            "field": "script"
          },
          {
            "field": "sys_name"
          }
        ],
        "table": "sys_script_include"
      },
      {
        "fields": [{
            "field": "sys_id"
          },
          {
            "field": "script"
          },
          {
            "field": "sys_name"
          }
        ],
        "table": "sys_script"
      }
    ]
  }

  return config_yaml;

}

module.exports = {
  getYaml: getYaml
}