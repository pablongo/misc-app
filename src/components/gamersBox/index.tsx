import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { gameBoxColors } from '../../utils';

const GamersBox: React.FC<{ userId: any, playerRooms: any }> = ({ userId, playerRooms }) => {
	return (
		<View style={{
			...styles.container,
			marginTop: playerRooms.length === 2 ? 0 : 50,
			height: playerRooms.length === 2 ? '80%' : '70%',
		}}>
			{
				playerRooms.map((gamer: any, i: any) => {
					return (
						<View
							style={{
								...styles.gamerBox,
								"borderBottomWidth": (playerRooms.length > 2 && i <= 1) ? 1 : 0,
								paddingBottom: (playerRooms.length > 2 && i <= 1) ? 40 : 0,
								width: (playerRooms.length === 3 && i === 2) ? "100%" : "50%"
							}}
							key={gamer?.user?.id}
						>
							<View style={{
								...styles.individualBox,
								"borderRightWidth": (playerRooms.length > 1 && i === 0 || playerRooms.length > 3 && i === 2) ? 1 : 0
							}}>
								<View style={{
									...styles.initialBox,
									backgroundColor: gameBoxColors(gamer?.status).boxColor
								}}>
									<Text style={styles.initialName}>{gamer?.user?.name !== "null null" ? gamer?.user?.name?.charAt(0).toUpperCase() : gamer?.user.userName.charAt(0).toUpperCase()}</Text>
								</View>
								<Text style={styles.gamerName}>{gamer?.user?.id === userId.userId ? "Tú" : `${gamer?.user?.name !== "null null" ? gamer?.user?.name?.charAt(0).toUpperCase() + gamer?.user?.name?.slice(1) : gamer?.user.userName.charAt(0).toUpperCase() + gamer?.user?.userName?.slice(1)}`}</Text>
								<View style={{ ...styles.state, backgroundColor: gameBoxColors(gamer?.status).boxColor }}>
									<Text style={{ color: gameBoxColors(gamer?.status).textColor }}>
										{gameBoxColors(gamer?.status).text}
									</Text>
								</View>
							</View>
						</View>
					)
				})
			}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		alignContent: "center",
	},
	gamerBox: {
		alignItems: "center",
		paddingVertical: 20,
		height: 260,
		borderColor: "#00443B",
	},
	individualBox: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		width: '100%',
		height: '100%',
		padding: 20,
		borderColor: "#00443B",
	},
	initialName: {
		fontFamily: 'Laurel',
		fontSize: 45,
		color: '#00443B',
		textAlign: "center",
	},
	initialBox: {
		borderRadius: 100,
		height: 115,
		width: 115,
		marginBottom: 10,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
	},
	gamerName: {
		fontFamily: 'Apercu Pro',
		fontWeight: 'normal',
		fontSize: 15,
		color: '#00443B',
		textAlign: "center"
	},
	state: {
		fontFamily: 'Apercu Pro',
		fontWeight: 'bold',
		fontSize: 12,
		paddingHorizontal: 20,
		paddingVertical: 10,
		marginTop: 10,
		borderRadius: 100
	}
})
export default GamersBox;