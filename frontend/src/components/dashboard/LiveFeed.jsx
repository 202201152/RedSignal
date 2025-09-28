import React from 'react';
import ReportForm from '../ReportForm';
import FeedItem from './FeedItem';
import styles from './LiveFeed.module.css';

const LiveFeed = ({ reports }) => {
    return (
        <div className={styles.container}>
            <div className={styles.reportFormWrapper}>
                <ReportForm />
            </div>
            <div className={styles.feedWrapper}>
                <h2 className={styles.feedTitle}>Live Feed</h2>
                <div className={styles.feedList}>
                    {reports.length > 0 ? (
                        reports.map(report => <FeedItem key={report._id} report={report} />)
                    ) : (
                        <p className={styles.emptyFeed}>No reports yet. Be the first to submit one.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveFeed;