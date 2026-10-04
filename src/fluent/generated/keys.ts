import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    'acl-scores-create': {
                        table: 'sys_security_acl'
                        id: '1961134f312d419a91db15ae75c73ded'
                    }
                    'acl-scores-read': {
                        table: 'sys_security_acl'
                        id: '5e2bb186e4714eadb82132afd55e3737'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: '55104091e08142f4b1c2529b87f29115'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '22185687a69f4a009ef2a2fbb9999b5d'
                    }
                    'rate-limit-scores': {
                        table: 'sys_script'
                        id: 'e3d7df6b25fd426dbf27c38e9570e7d8'
                    }
                    'src_server_business-rules_rate-limit-scores_ts': {
                        table: 'sys_module'
                        id: 'fb383da0008246e1b45cf78d7286e2a2'
                    }
                    tetris_app_menu: {
                        table: 'sys_app_application'
                        id: '1cc5a7b39d57483d9ed4b8f095205c5c'
                    }
                    tetris_game_module: {
                        table: 'sys_app_module'
                        id: 'a078dcf2285347e0b9191245a7c5210f'
                    }
                }
                composite: [
                    {
                        table: 'sys_documentation'
                        id: '04c7732092d445ecbec20b1130ba85b7'
                        deleted: true
                        key: {
                            name: 'u_tetris_high_scores'
                            element: 'score'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '0823cb69303e4314a7d4522c70cc409d'
                        key: {
                            name: 'u_tetris_high_scores'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0e84e2465b9f44939fddfe09be153e2a'
                        key: {
                            name: 'u_tetris_high_scores'
                            element: 'u_player_name'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1181446da8384b5f95e55b2f157e69c9'
                        key: {
                            name: 'u_tetris_high_scores'
                            element: 'u_level'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '174b3310945b4098800be24f2aadbfa2'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '97fa9d88446340d08d86814a7912b673'
                                key: {
                                    name: 'u_tetris_high_scores'
                                    caption: 'Score Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'player_name'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1b82191da39948508b126e08682adf68'
                        deleted: true
                        key: {
                            name: 'u_tetris_high_scores'
                            element: 'player_name'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '1fbb6b60818144978314837ce694a6ad'
                        key: {
                            name: 'u_tetris_high_scores'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '21dca6b3ca614a789bb33a2934b486d6'
                        key: {
                            name: 'tetris_game.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2f4d256404244aeea82a97a4e802f11a'
                        key: {
                            sys_ui_section: {
                                id: '97fa9d88446340d08d86814a7912b673'
                                key: {
                                    name: 'u_tetris_high_scores'
                                    caption: 'Score Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '3'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '306b9602ab4e4cada1e4d46abcc71ff9'
                        key: {
                            application_file: 'd37ce13085894e1ea64c7404797184c8'
                            source_artifact: '21dca6b3ca614a789bb33a2934b486d6'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '335e8167551641dd95027b8e9f89cae4'
                        key: {
                            name: 'u_tetris_high_scores'
                            element: 'u_player_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4a48097f9c8148c29ccd7f4253eb002c'
                        deleted: true
                        key: {
                            name: 'u_tetris_high_scores'
                            element: 'player_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4a63305cdfdc4bbca4580f98d0fb9250'
                        key: {
                            name: 'u_tetris_high_scores'
                            element: 'u_score'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '4d0be5f8418447cbbc8a11a97c7cb333'
                        key: {
                            application_file: '6d7d67777d394ea1bd25b198b910278d'
                            source_artifact: '21dca6b3ca614a789bb33a2934b486d6'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '4e5abf705e314f39b51630abaff88c31'
                        key: {
                            application_file: 'd5e47eb351ad41139e0fb357995587f5'
                            source_artifact: '21dca6b3ca614a789bb33a2934b486d6'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5668ec92e5a94945956700bfe2358e61'
                        deleted: true
                        key: {
                            name: 'u_tetris_high_scores'
                            element: 'score'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '659c2263b5be4e5585a5c0f6c82a53a1'
                        key: {
                            application_file: '6d1cbc7a264c4ca6b4045024571dfe1d'
                            source_artifact: '21dca6b3ca614a789bb33a2934b486d6'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '6d1cbc7a264c4ca6b4045024571dfe1d'
                        key: {
                            name: 'global/main.js.map'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '6d7d67777d394ea1bd25b198b910278d'
                        key: {
                            name: 'global/vendor-react-dom--8ba4e2ad'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6e755f15a99d44f5859f689295cc3cb2'
                        key: {
                            name: 'u_tetris_high_scores'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7b22b2f0e975405c9105ff84c9f6f679'
                        key: {
                            name: 'u_tetris_high_scores'
                            element: 'u_level'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7b7d9b3c0c1b4d95af5943955045259f'
                        key: {
                            name: 'u_tetris_high_scores'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '7ca258eba1e44ced90988280a3a77535'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '97fa9d88446340d08d86814a7912b673'
                                key: {
                                    name: 'u_tetris_high_scores'
                                    caption: 'Score Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'score'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '83343a092b0848168d5c2e5155292b2d'
                        key: {
                            sys_ui_section: {
                                id: '97fa9d88446340d08d86814a7912b673'
                                key: {
                                    name: 'u_tetris_high_scores'
                                    caption: 'Score Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '93e302afe4bb4cee9878942ca45a35fc'
                        key: {
                            name: 'global/main'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '97fa9d88446340d08d86814a7912b673'
                        key: {
                            name: 'u_tetris_high_scores'
                            caption: 'Score Details'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '989208165db3432da85fac09d00a2e55'
                        key: {
                            sys_ui_section: {
                                id: '97fa9d88446340d08d86814a7912b673'
                                key: {
                                    name: 'u_tetris_high_scores'
                                    caption: 'Score Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_score'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '9c94c97153d94118aa693bd2ba485cc6'
                        key: {
                            sys_ui_form: {
                                id: '1fbb6b60818144978314837ce694a6ad'
                                key: {
                                    name: 'u_tetris_high_scores'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '97fa9d88446340d08d86814a7912b673'
                                key: {
                                    name: 'u_tetris_high_scores'
                                    caption: 'Score Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'b3272fd20e454f2f822cf0ed35a10e93'
                        key: {
                            application_file: '93e302afe4bb4cee9878942ca45a35fc'
                            source_artifact: '21dca6b3ca614a789bb33a2934b486d6'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bac84196037b495f8440e3260660709a'
                        deleted: true
                        key: {
                            name: 'u_tetris_high_scores'
                            element: 'level'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'c2ca0f17514f4a6da83caeb8f792a331'
                        key: {
                            name: 'u_tetris_high_scores'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c643cdbe613f4b1fbbc7fd09035214f5'
                        deleted: true
                        key: {
                            name: 'u_tetris_high_scores'
                            element: 'level'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c8ac78110c86465ca7377e7a3423243d'
                        deleted: true
                        key: {
                            sys_ui_section: {
                                id: '97fa9d88446340d08d86814a7912b673'
                                key: {
                                    name: 'u_tetris_high_scores'
                                    caption: 'Score Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'level'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'cd6eb8398bfa460b964e44cbd16866b5'
                        key: {
                            sys_ui_section: {
                                id: '97fa9d88446340d08d86814a7912b673'
                                key: {
                                    name: 'u_tetris_high_scores'
                                    caption: 'Score Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ce0585bd20004249930fecff362d6fa1'
                        key: {
                            sys_ui_section: {
                                id: '97fa9d88446340d08d86814a7912b673'
                                key: {
                                    name: 'u_tetris_high_scores'
                                    caption: 'Score Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_level'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'd37ce13085894e1ea64c7404797184c8'
                        key: {
                            name: 'global/vendor-react-dom--8ba4e2ad.js.map'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: 'd5e47eb351ad41139e0fb357995587f5'
                        key: {
                            name: 'tetris_game'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dea3931a913f4793b73e63be92f5966b'
                        key: {
                            name: 'u_tetris_high_scores'
                            element: 'u_score'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'fe8e7b0fc344437bbb66bf26901c3282'
                        key: {
                            sys_ui_section: {
                                id: '97fa9d88446340d08d86814a7912b673'
                                key: {
                                    name: 'u_tetris_high_scores'
                                    caption: 'Score Details'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'u_player_name'
                            position: '1'
                        }
                    },
                ]
            }
        }
    }
}
