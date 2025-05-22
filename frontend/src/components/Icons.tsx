import React from 'react';


interface IconProps {
    classes?: string;
}


const SolidSvgContainer = (children: React.ReactNode): React.FC<IconProps> => ({ classes }) => <svg className={ classes } xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">{ children }</svg>;

const SvgContainer = (children: React.ReactNode): React.FC<IconProps> => ({ classes }) => <svg className={ classes } xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">{ children }</svg>;

export const IdentificationIcon = SvgContainer(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />);

export const BookOpenIcon = SvgContainer(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />);

export const ArrowCircleLeftIcon = SvgContainer(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />);

export const UserCircleIcon = SvgContainer(<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />);

export const ExclamationSolidIcon = SolidSvgContainer(<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />);