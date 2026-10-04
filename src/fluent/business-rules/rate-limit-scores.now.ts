import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { rateLimitScores } from '../../server/business-rules/rate-limit-scores'

/**
 * Rate-limit score submissions to prevent DDoS / spam.
 * Max 10 inserts per user per minute. Aborts if exceeded.
 */
BusinessRule({
    $id: Now.ID['rate-limit-scores'],
    name: 'Rate Limit Tetris Score Submissions',
    table: 'u_tetris_high_scores',
    when: 'before',
    action: ['insert'],
    order: 50,
    active: true,
    script: rateLimitScores,
})
