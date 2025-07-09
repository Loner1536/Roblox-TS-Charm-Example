// Packages
import Vide, { derive, spring } from "@rbxts/vide";

// Types
import type * as Types from "shared/types";

// Utility
import formats from "@utility/formats";
import tweens from "@utility/tweens";
import px from "@utility/px";

// Shared
import sharedConstants from "@shared/constants";

// Components
import { Button } from "../components/button";

export function BottomMenuContainer({ props }: { props: Types.InterfaceProps.default }) {
	const moneyTween = tweens.number(
		derive(() => props.playerData.currencies().money),
		2,
		Enum.EasingStyle.Exponential,
		Enum.EasingDirection.InOut,
	);

	return (
		<frame
			Name={"BottomMenuContainer"}
			BackgroundTransparency={1}
			AnchorPoint={new Vector2(0.5, 1)}
			Position={px.spring(
				(scale) => {
					const yOffset = props.bottomMenu.visible() ? 0 : 250;
					return scale.uDim2(0.5, 0, 1, yOffset);
				},
				0.25,
				0.5,
			)}
			Size={px.uDim2(800, 200)}
		>
			<textlabel
				Name={"Money"}
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0.5, 0)}
				Position={px.uDim2(0.5, 0, 0, -35)}
				Size={px.uDim2(200, 50)}
				Text={() => `$${formats.number(moneyTween())}`}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				FontFace={sharedConstants.fonts.current.regular}
				TextSize={px.number(54)}
			>
				<uistroke Thickness={px.number(2.5)} Transparency={0.5} />
			</textlabel>
			<frame
				Name={"Buttons"}
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
			>
				<Button
					name={"Money 1"}
					position={px.uDim2(0.5, 200, 0.5, 0)}
					size={(onHover, onPress) => {
						return px.spring(
							(scale) => {
								const multi = onPress() ? 1.025 : onHover() ? 1.075 : 1;
								return scale.uDim2(350 * multi, 150 * multi);
							},
							0.25,
							0.75,
						);
					}}
					text={"1"}
					textSize={px.number(32)}
					fontFace={sharedConstants.fonts.current.regular}
					color={sharedConstants.gradients.green.regular}
					onRelease={() => {
						props.network.update.fire({
							type: "money",
							action: {
								type: "click",
								value: "one",
							},
						});
					}}
				/>
				<Button
					name={"Money 10"}
					position={px.uDim2(0.5, -200, 0.5, 0)}
					size={(onHover, onPress) => {
						return px.spring(
							(scale) => {
								const multi = onPress() ? 1.025 : onHover() ? 1.075 : 1;
								return scale.uDim2(350 * multi, 150 * multi);
							},
							0.25,
							0.75,
						);
					}}
					text={"10"}
					textSize={px.number(32)}
					fontFace={sharedConstants.fonts.current.regular}
					color={() => {
						return props.playerData.totalClicks() > 10
							? sharedConstants.gradients.green.regular
							: sharedConstants.gradients.red.regular;
					}}
					onRelease={() => {
						if (props.playerData.totalClicks() > 10)
							props.network.update.fire({
								type: "money",
								action: {
									type: "click",
									value: "ten",
								},
							});
					}}
				/>
				<uilistlayout
					Padding={px.uDim(20)}
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalFlex={Enum.UIFlexAlignment.SpaceAround}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>
			</frame>
		</frame>
	);
}
