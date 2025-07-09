// Packages
import Vide from "@rbxts/vide";

// Types
import type * as Types from "shared/types";

// Utility
import px from "@utility/px";

// Components
const { source } = Vide;

interface Props {
	name?: string;
	anchorPoint?: Vector2;
	position?: UDim2 | Vide.Source<UDim2>;
	size: (onHover: Vide.Source<boolean>, onPress: Vide.Source<boolean>) => Vide.Source<UDim2>;

	color: ColorSequence | Vide.Source<ColorSequence>;

	text?: string | Vide.Source<string>;
	textSize?: Vide.Source<number>;
	fontFace?: Font;

	onRelease?: () => void;
}

export function Button({ name, anchorPoint, position, size, text, textSize, fontFace, color, onRelease }: Props) {
	const onHover = source(false);
	const onPress = source(false);

	return (
		<frame
			Name={name}
			BackgroundColor3={Color3.fromRGB(255, 255, 255)}
			AnchorPoint={anchorPoint ?? new Vector2(0.5, 0.5)}
			Position={position ?? UDim2.fromScale(0.5, 0.5)}
			Size={size(onHover, onPress)}
		>
			<textbutton
				Name={"Button"}
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				MouseEnter={() => onHover(true)}
				MouseLeave={() => {
					onHover(false);
					onPress(false);
				}}
				MouseButton1Down={() => onPress(true)}
				MouseButton1Up={() => {
					if (onRelease) onRelease();
					onPress(false);
				}}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={textSize ? true : false}
				TextSize={textSize}
				FontFace={fontFace}
				Text={text}
			>
				<uistroke Thickness={px.number(6)} Transparency={0.5} />
				<uicorner CornerRadius={px.uDim(10)} />
			</textbutton>
			<uigradient Color={color} Rotation={90} />
			<uistroke Thickness={px.number(3)} Color={Color3.fromRGB(255, 255, 255)} Transparency={0.5} />
			<uicorner CornerRadius={px.uDim(10)} />
		</frame>
	);
}
