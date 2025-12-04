
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { Repo } from './models';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';



export default function Home() {
    const [loading, setLoading] = useState(false);
    const [repos, setRepos] = useState<Repo[]>([]);

    useEffect(() => {

        callGithub();

    }, []);

    async function callGithub() {

        try {
            setLoading(true);

            const response = await fetch(
                "https://api.github.com/search/repositories?q=created:>2024-01-01&sort=stars&order=desc",
                {
                    headers: {
                        "Accept": "application/vnd.github+json",
                        "Accept-Encoding": "identity",
                        "User-Agent": "expo-app",
                    },
                }
            );
            const json = await response.json();


            const rs: Repo[] = json.items;


            setRepos(rs);


        } catch (err) {
            console.error("Api error: ", err);
        } finally {
            setLoading(false);
        }

    }


    function renderItem({ item }: { item: Repo }) {
        return (
            <View style={styles.repoCard}>
                <Image source={{ uri: item.owner.avatar_url }} style={styles.repoImage} />
                <View >
                    <Text style={styles.repoName}>{item.full_name}</Text>
                    <Text style={styles.stars}>⭐ {item.stargazers_count}</Text>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top"]} style={styles.container}>

                <AppBar loadRepos={callGithub} />


                {
                    loading ?
                        <View style={{ height: '100%', backgroundColor: '#fff' }}>
                            <ActivityIndicator style={styles.loadingIndicator} size={"large"} />
                        </View> :
                        <FlatList
                            data={repos}
                            renderItem={renderItem}
                            style={{ backgroundColor: '#fff' }}
                        />
                }
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#222" },



    appBar: {
        height: 60,
        paddingHorizontal: 16,
        backgroundColor: "#222",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },

    refreshButton: {
        backgroundColor: "#444",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },

    refreshText: {
        color: "white",
        fontWeight: "600",
    },

    repoCard: {
        backgroundColor: "#eee",
        padding: 12,
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: "row",
        alignItems: "center"
    },

    repoImage: {
        borderRadius: 90,
        marginEnd: 12,
        width: 40,
        height: 40,
    },

    repoName: {
        fontSize: 16,
        fontWeight: "bold",
        marginEnd: 24,
    },

    repoDesc: {
        color: "#444",
        marginTop: 4,
    },

    stars: {
        marginTop: 4,
        fontWeight: "600",
    },

    loadingIndicator: {
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
});

type AppBarProps = {
    loadRepos: () => void;
}

function AppBar({ loadRepos }: AppBarProps) {
    return (
        <View style={styles.appBar}>
            <Text style={styles.title}>GitHub Repos u2020rn</Text>

            <TouchableOpacity onPress={loadRepos} style={styles.refreshButton}>
                <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
        </View>
    )
}