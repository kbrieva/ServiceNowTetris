import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

/**
 * ACLs for u_tetris_high_scores — allow any authenticated user to
 * read scores and create new ones. No role required (empty roles = all logged-in users).
 * This makes the game shareable: anyone with a ServiceNow login can play and submit scores.
 */

// Allow all authenticated users to read high scores
Record({
    $id: Now.ID['acl-scores-read'],
    table: 'sys_security_acl',
    data: {
        name: 'u_tetris_high_scores',
        operation: 'read',
        type: 'record',
        active: true,
        admin_overrides: true,
        description: 'Allow all authenticated users to read Tetris high scores',
    },
})

// Allow all authenticated users to create (submit) new scores
Record({
    $id: Now.ID['acl-scores-create'],
    table: 'sys_security_acl',
    data: {
        name: 'u_tetris_high_scores',
        operation: 'create',
        type: 'record',
        active: true,
        admin_overrides: true,
        description: 'Allow all authenticated users to submit Tetris scores',
    },
})
