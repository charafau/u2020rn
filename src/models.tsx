
export interface User {
    id: number;
    login: string;
    avatar_url: string;
    url: string;
    html_url: string;
}

export interface Repo {
    id: number;
    name: string;
    full_name: string;
    html_url: string;

    owner: User;

    stargazers_count: number;
    watchers_count: number;
    forks: number;
    language: string | null;

}