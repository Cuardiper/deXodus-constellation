package core

import (
	"math/big"
	"testing"

	"github.com/ethereum/go-ethereum/common"
	ocr2keepers "github.com/smartcontractkit/ocr2keepers/pkg/v3/types"

	"github.com/stretchr/testify/assert"
)

func TestWorkID(t *testing.T) {
	tests := []struct {
		name     string
		upkeepID string
		trigger  ocr2keepers.Trigger
		expected string
	}{
		{
			name:     "happy flow no extension",
			upkeepID: "12345",
			trigger: ocr2keepers.Trigger{
				BlockNumber: 123,
				BlockHash:   common.HexToHash("0xabcdef"),
			},
			expected: "e546b0a52c2879744f6def0fb483d581dc6d205de83af8440456804dd8b62380",
		},
		{
			name:     "empty trigger",
			upkeepID: "12345",
			trigger:  ocr2keepers.Trigger{},
			// same as with no extension
			expected: "e546b0a52c2879744f6def0fb483d581dc6d205de83af8440456804dd8b62380",
		},
		{
			name:     "happy flow with extension",
			upkeepID: GenUpkeepID(ocr2keepers.LogTrigger, "12345").String(),
			trigger: ocr2keepers.Trigger{
				BlockNumber: 123,
				BlockHash:   common.HexToHash("0xabcdef"),
				LogTriggerExtension: &ocr2keepers.LogTriggerExtension{
					Index:  1,
					TxHash: common.HexToHash("0x12345"),
				},
			},
			expected: "db0e245ff4e7551d6c862d9a0eb5466624e1439ad1db262a7a3d6137d892d0a3",
		},
		{
			name:     "happy path example from an actual tx",
			upkeepID: "57755329819103678328139927896464733492677608573736038892412245689671711489918",
			trigger: ocr2keepers.Trigger{
				BlockNumber: 39344455,
				BlockHash:   common.HexToHash("0xb41258d18cd44ebf7a0d70de011f2bc4a67c9b68e8b6dada864045d8543bb020"),
				LogTriggerExtension: &ocr2keepers.LogTriggerExtension{
					Index:  41,
					TxHash: common.HexToHash("0x44079b1b33aff337dbf17b9e12c5724ecab979c50c8201a9814a488ff3e22384"),
				},
			},
			expected: "cdb4cfd9b4855b28d243d099c41b832da6b2d99dda3e7d09b900899afd09328f",
		},
		{
			name:     "empty upkeepID",
			upkeepID: "0",
			trigger: ocr2keepers.Trigger{
				BlockNumber: 123,
				BlockHash:   common.HexToHash("0xabcdef"),
			},
			expected: "290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			// Convert the string to a big.Int
			var id big.Int
			_, success := id.SetString(tc.upkeepID, 10)
			if !success {
				t.Fatal("Invalid big integer value")
			}
			uid := &ocr2keepers.UpkeepIdentifier{}
			ok := uid.FromBigInt(&id)
			if !ok {
				t.Fatal("Invalid upkeep identifier")
			}

			res := UpkeepWorkID(*uid, tc.trigger)
			assert.Equal(t, tc.expected, res, "UpkeepWorkID mismatch")
		})
	}
}

func TestNewUpkeepPayload(t *testing.T) {
	tests := []struct {
		name       string
		upkeepID   *big.Int
		upkeepType ocr2keepers.UpkeepType
		trigger    ocr2keepers.Trigger
		check      []byte
		errored    bool
		workID     string
	}{
		{
			name:       "happy flow no extension",
			upkeepID:   big.NewInt(111),
			upkeepType: ocr2keepers.ConditionTrigger,
			trigger: ocr2keepers.Trigger{
				BlockNumber: 11,
				BlockHash:   common.HexToHash("0x11111"),
			},
			check:  []byte("check-data-111"),
			workID: "39f2babe526038520877fc7c33d81accf578af4a06c5fa6b0d038cae36e12711",
		},
		{
			name:       "happy flow with extension",
			upkeepID:   big.NewInt(111),
			upkeepType: ocr2keepers.LogTrigger,
			trigger: ocr2keepers.Trigger{
				BlockNumber: 11,
				BlockHash:   common.HexToHash("0x11111"),
				LogTriggerExtension: &ocr2keepers.LogTriggerExtension{
					Index:  1,
					TxHash: common.HexToHash("0x11111"),
				},
			},
			check:  []byte("check-data-111"),
			workID: "d2fc1c0d626b480a4180f30b89142ae727c85e0b4dc0a82645bcef8062ff932a",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			payload, err := NewUpkeepPayload(
				tc.upkeepID,
				tc.trigger,
				tc.check,
			)
			if tc.errored {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)

			assert.Equal(t, tc.workID, payload.WorkID)
		})
	}
}