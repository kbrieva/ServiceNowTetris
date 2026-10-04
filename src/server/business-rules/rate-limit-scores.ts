import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'

/**
 * Rate limiter for Tetris score submissions.
 * Blocks more than 10 inserts per user per minute.
 * Prevents automated abuse / DDoS-style spamming of the score table.
 */
export function rateLimitScores(current: any): void {
    var MAX_PER_MINUTE = 10;

    var userID = gs.getUserID();
    var oneMinuteAgo = new GlideDateTime();
    oneMinuteAgo.addSeconds(-60);

    var gr = new GlideRecord('u_tetris_high_scores');
    gr.addQuery('sys_created_by', gs.getUserName());
    gr.addQuery('sys_created_on', '>=', oneMinuteAgo.getValue());
    gr.query();
    var count = gr.getRowCount();

    if (count >= MAX_PER_MINUTE) {
        gs.addErrorMessage('Too many score submissions. Please wait a moment before trying again.');
        current.setAbortAction(true);
    }
}
