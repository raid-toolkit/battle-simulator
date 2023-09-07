import { CloseCircleOutlined, FireOutlined } from '@ant-design/icons';
import { Result, Typography } from 'antd';
import React from 'react';
import { BattleTurn, getConfig, useAppModel } from '../Model';
import { TurnGroupCardView } from './TurnGroupCardView';
import './TurnSimulatorView.css';

export interface TurnSimulatorViewProps {}

const { Paragraph, Text } = Typography;

export const EmptyWithErrors: React.FC = () => {
  const {
    state: { turnSimulationErrors },
  } = useAppModel();
  const errors = turnSimulationErrors.filter((err) => err instanceof Error) as Error[];
  const validationErrors = turnSimulationErrors.filter((err) => typeof err === 'string') as string[];

  return (
    <Result
      status={errors.length > 0 ? 'error' : errors.length > 0 ? 'warning' : 'info'}
      title="Battle simulation not available"
      icon={
        errors.length ? (
          <img
            src="/images/loading-logo.png"
            alt="Cardiel using a calculator with sexy armor."
            style={{ borderRadius: '100%', objectFit: 'fill', margin: 32 }}
          />
        ) : (
          <FireOutlined />
        )
      }
    >
      {validationErrors.length > 0 ? (
        <div>
          <Paragraph>
            <Text
              strong
              style={{
                fontSize: 16,
              }}
            >
              The following information is missing:
            </Text>
          </Paragraph>
          {validationErrors.map((error) => (
            <Paragraph>
              <CloseCircleOutlined className="error-icon" />
              {error}
            </Paragraph>
          ))}
        </div>
      ) : errors.length > 0 ? (
        <div>
          <Paragraph>
            <Text
              strong
              style={{
                fontSize: 16,
              }}
            >
              The following errors were encountered:
            </Text>
          </Paragraph>
          {errors.map((error) => (
            <Paragraph>
              <CloseCircleOutlined className="error-icon" />
              {error.message}
            </Paragraph>
          ))}
        </div>
      ) : (
        <div>
          <Paragraph>
            <Text
              strong
              style={{
                fontSize: 16,
              }}
            >
              Set a team up to simulate a battle.
            </Text>
          </Paragraph>
        </div>
      )}
    </Result>
  );
};

export const TurnSimulatorView: React.FC<TurnSimulatorViewProps> = () => {
  const { state } = useAppModel();

  const turnGroups = React.useMemo(() => {
    const turnGroups: BattleTurn[][] = [];
    const config = getConfig(state);
    const fastestHeroIndex = state.tuneState.championList.indexOf(
      [...state.tuneState.championList].sort((a, b) => (a.speed ?? 0) - (b.speed ?? 0))[0]
    );
    let fastestChampTurnCount = 0;
    try {
      for (const turn of state.turnSimulation) {
        switch (config?.grouping ?? 'none') {
          case 'none':
            (turnGroups[0] = turnGroups[0] || []).push(turn);
            break;
          case 'boss-turn':
            (turnGroups[turn.bossTurnIndex] = turnGroups[turn.bossTurnIndex] || []).push(turn);
            break;
          case 'slowest':
            (turnGroups[fastestChampTurnCount] = turnGroups[fastestChampTurnCount] || []).push(turn);
            break;
        }

        if (turn.championIndex === fastestHeroIndex) ++fastestChampTurnCount;
      }
    } catch (e) {
      console.error(e);
    }
    return turnGroups;
    // last group may be incomplete
    // turnGroups.push(currentTurnGroup);
  }, [state]);

  const turnCards = turnGroups.map((turnGroup, index) => (
    <TurnGroupCardView key={`group_${index}`} turnSequence={index + 1} turns={turnGroup} />
  ));

  return <div className="turn-simulator-view">{turnCards.length > 0 ? turnCards : <EmptyWithErrors />}</div>;
};
