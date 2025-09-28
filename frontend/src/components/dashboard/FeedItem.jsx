import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FiAlertTriangle } from 'react-icons/fi';
import styles from './FeedItem.module.css';

const FeedItem = ({ report }) => {
    const getStatusClass = (status) => {
        if (status === 'verified') return styles.verified;
        if (status === 'pending') return styles.pending;
        return '';
    };

    return (
        <div className={styles.card}>
            <div className={styles.icon}>
                <FiAlertTriangle size={20} />
            </div>
            <div className={styles.content}>
                <p className={styles.text}>{report.text}</p>
                <div className={styles.footer}>
                    <span className={`${styles.status} ${getStatusClass(report.status)}`}>{report.status}</span>
                    <span className={styles.time}>{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</span>
                </div>
            </div>
        </div>
    );
};

export default FeedItem;