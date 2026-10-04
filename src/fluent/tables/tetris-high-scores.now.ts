import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, Form, default_view } from '@servicenow/sdk/core'

export const u_tetris_high_scores = Table({
    name: 'u_tetris_high_scores',
    label: 'Tetris High Scores',
    display: 'u_player_name',
    allowWebServiceAccess: true,
    schema: {
        u_player_name: StringColumn({
            label: 'Player Name',
            mandatory: true,
            maxLength: 100,
        }),
        u_score: IntegerColumn({
            label: 'Score',
            mandatory: true,
            default: 0,
        }),
        u_level: IntegerColumn({
            label: 'Level',
            mandatory: true,
            default: 1,
        }),
    },
})

Form({
    table: 'u_tetris_high_scores',
    view: default_view,
    sections: [
        {
            caption: 'Score Details',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'u_player_name', type: 'table_field' },
                        { field: 'u_score', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'u_level', type: 'table_field' },
                    ],
                },
            ],
        },
    ],
})
